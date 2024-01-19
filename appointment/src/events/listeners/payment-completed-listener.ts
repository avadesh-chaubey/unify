import { Listener, PaymentCompletedEvent, Subjects, AppointmentStatus, SlotAvailability, AppointmentPaymentStatus, OrderStatus, ConsultationType, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { paymentCompletedGroupName } from './queue-group-name';
import { Appointment } from '../../models/appointment';
import { AppointmentConfig } from '../../models/appointment-config';
import { AppointmentBookedPublisher } from '../publishers/appointment-booked-publisher';
import { natsWrapper } from '../../nats-wrapper';
import moment from 'moment';
import { PhysicianAssistantRoster, Roster } from '../../models/physician-assistant-roster';
import { Consultant } from '../../models/consultant';

export class PaymentCompletedListener extends Listener<PaymentCompletedEvent> {
  subject: Subjects.PaymentCompleted = Subjects.PaymentCompleted;
  queueGroupName = paymentCompletedGroupName;

  async onMessage(data: PaymentCompletedEvent['data'], msg: Message) {
    console.log('PaymentStatusEvent for id: ', data.productId);

    const appointment = await Appointment.findById(data.productId);
    if (!appointment) {
      msg.ack();
      return;
    }
    //console.log('AppointmentStatus = ' + appointment.appointmentPaymentStatus);
    if (appointment.appointmentPaymentStatus === AppointmentPaymentStatus.Created
      || appointment.appointmentPaymentStatus === AppointmentPaymentStatus.Blocked) {
      const appointmentTrack = {
        stateUpdateTime: new Date(),
        state: AppointmentPaymentStatus.Booked,
        appointmentDate: appointment.appointmentDate,
        appointmentSlotId: String(appointment.appointmentSlotId),
        appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
        updatedBy: UserType.Patient,
      }
      const appList = [...appointment.appointmentTimeLine];
      appList.push(appointmentTrack);

      console.log('ConsultationType = ' + appointment.consultationType);
      if (appointment.consultationType === ConsultationType.Diabetologist) {
        const assistantAppointmentTrack = {
          stateUpdateTime: new Date(),
          state: AppointmentStatus.CaseHistoryPending,
          appointmentDate: appointment.assistantAppointmentDate,
          appointmentSlotId: String(appointment.assistantAppointmentSlotId),
          appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
          updatedBy: UserType.Patient,
        }

        let dateIndex = 0;
        if (!moment(appointment.appointmentDate).isSame(moment().utcOffset(330).format('YYYY-MM-DD'))) {
          dateIndex = moment(appointment.appointmentDate).utcOffset(330)
            .diff(moment().utcOffset(330), 'days') + 1;
        }

        //allocate assistant for this appointment
        //1: Fetch Roster of all assistants
        //2: Get list of Assistants available on appointment date
        //3: Get list of assistants available during that slot
        //4: Assign Assistant with minimum number of appointments that day from above list.
        //

        let assistantId = 'NA';
        let iAmBackupAssistant = 'NA';
        let indexOfBackupAssistant = -1;
        const assistantRoster = await PhysicianAssistantRoster.findOne({});
        if (assistantRoster) {
          const appointmentDayAssistantList = [...assistantRoster.availableAssistantList[dateIndex]];
          if (appointmentDayAssistantList && appointmentDayAssistantList.length > 0) {
            console.log('--------- Befor Allocation ------- ');
            console.log('appointmentDate  = ' + appointment.appointmentDate);
            console.log('Todays Date  = ' + moment().utcOffset(330).format('YYYY-MM-DD'));
            console.log('dateIndex  = ' + dateIndex);
            console.log('Number Of Assistant Found = ' + appointmentDayAssistantList.length)
            console.log('Requested Slot = ' + appointment.appointmentSlotId)
            for (let i = 0; i < appointmentDayAssistantList.length; i++) {
              console.log('Start Slot: ' + appointmentDayAssistantList[i].shiftFirstSlotId
                + ", End Slot: " + appointmentDayAssistantList[i].shiftLastSlotId
                + ", No Of Appointments: " + appointmentDayAssistantList[i].numberOfAppointments
                + ", "
                + appointmentDayAssistantList[i].physicianAssistantId);
            }

            for (let i = 0; i < appointmentDayAssistantList.length; i++) {
              if (appointmentDayAssistantList[i].shiftFirstSlotId <= appointment.appointmentSlotId
                && appointmentDayAssistantList[i].shiftLastSlotId >= appointment.appointmentSlotId
                && !appointmentDayAssistantList[i].weeklyDayOff
                && !appointmentDayAssistantList[i].onLeaveThisDay) {
                const exsistingAppointment = await Appointment.findOne({
                  assistantId: appointmentDayAssistantList[i].physicianAssistantId,
                  appointmentDate: appointment.appointmentDate,
                  appointmentSlotId: appointment.appointmentSlotId
                });
                if (!exsistingAppointment) {
                  console.log('Assistant Fount Id = ' + appointmentDayAssistantList[i].physicianAssistantId);
                  assistantId = appointmentDayAssistantList[i].physicianAssistantId;
                  appointmentDayAssistantList[i].numberOfAppointments = appointmentDayAssistantList[i].numberOfAppointments + 1;
                  break;
                } else if (iAmBackupAssistant === 'NA' && indexOfBackupAssistant == -1) {
                  //console.log(exsistingAppointment);
                  iAmBackupAssistant = appointmentDayAssistantList[i].physicianAssistantId;
                  indexOfBackupAssistant = i;
                }
              }
            }


            if (assistantId === 'NA') {
              console.log("Unable to find Assistant for Appointment ID: " + appointment.id);
              if (iAmBackupAssistant !== 'NA' && indexOfBackupAssistant != -1) {
                console.log("Allocating Backup Assistant:  " + appointmentDayAssistantList[indexOfBackupAssistant].physicianAssistantId);
                assistantId = appointmentDayAssistantList[indexOfBackupAssistant].physicianAssistantId;
                appointmentDayAssistantList[indexOfBackupAssistant].numberOfAppointments = appointmentDayAssistantList[indexOfBackupAssistant].numberOfAppointments + 1;
              } else {
                console.log("Allocating Default Diahome Assistant");
                const emailId = String(process.env.DEFAULT_ASSISTANT_EMAIL_ID)
                const defaultAssistant = await Consultant.findOne({ emailId: emailId });
                if (defaultAssistant) {
                  assistantId = defaultAssistant.id!;
                }
              }
            }

            //this is a sorted array by numberOfAppointments
            var sortedAssistantList = appointmentDayAssistantList.sort((n1, n2) => {
              if (n1.numberOfAppointments > n2.numberOfAppointments) {
                return 1;
              }
              if (n1.numberOfAppointments < n2.numberOfAppointments) {
                return -1;
              }
              return 0;
            });

            // console.log('--------- After Allocation ------- ');
            // for (let i = 0; i < sortedAssistantList.length; i++) {
            //   console.log(sortedAssistantList[i].numberOfAppointments + " " + sortedAssistantList[i].physicianAssistantId);
            // }

            assistantRoster.availableAssistantList.splice(dateIndex, 1, sortedAssistantList);
            await assistantRoster.save();
          }
        }

        const assistantAppList = [...appointment.assistantAppointmentTimeLine];


        assistantAppList.push(assistantAppointmentTrack);

        appointment.set({
          assistantAppointmentTimeLine: assistantAppList,
          appointmentTimeLine: appList,
          appointmentPaymentStatus: AppointmentPaymentStatus.Booked,
          assistantId: assistantId,
          appointmentStatus: assistantAppointmentTrack.state,
          assistantAppointmentDate: appointment.assistantAppointmentDate,
          assistantAppointmentSlotId: appointment.assistantAppointmentSlotId,
          assistantConsecutiveBookedSlots: appointment.assistantConsecutiveBookedSlots,
          orderStatus: OrderStatus.Paid,
          arhOrderId: data.arhOrderId,
          paymentMode: data.paymentMode,
          assistantNotRequired: false,
        });
        await appointment.save();
      } else {
        appointment.set({
          appointmentTimeLine: appList,
          appointmentPaymentStatus: AppointmentPaymentStatus.Booked,
          appointmentStatus: AppointmentStatus.ReadyForDoctorConsultation,
          orderStatus: OrderStatus.Paid,
          arhOrderId: data.arhOrderId,
          paymentMode: data.paymentMode,
          assistantNotRequired: true,
        });
        await appointment.save();
      }

      const existingAppointmentConfig = await AppointmentConfig.findOne({
        consultantId: appointment.consultantId,
        appointmentDate: appointment.appointmentDate
      });
      if (!existingAppointmentConfig) {
        console.error('Apppointment Config Not Consultant for Id: ', appointment.consultantId);
        msg.ack();
        return;
      }
      if (existingAppointmentConfig.availableSlots[appointment.appointmentSlotId] === SlotAvailability.Blocked) {
        const newList = [...existingAppointmentConfig.availableSlots];
        newList[appointment.appointmentSlotId] = SlotAvailability.Booked;
        existingAppointmentConfig.set({
          availableSlots: newList,
          totalBookedSlots: existingAppointmentConfig.totalBookedSlots + 1,
        });
        await existingAppointmentConfig.save();
      }

      ///// Publish New Appointment Message /////////////
      new AppointmentBookedPublisher(natsWrapper.client).publish({
        appointmentId: appointment.id!,
        consultantId: appointment.consultantId,
        customerId: appointment.customerId,
        creatorId: appointment.creatorId,
        partnerId: appointment.partnerId,
        parentId: appointment.parentId,
        createdBy: appointment.createdBy,
        basePriceInINR: appointment.basePriceInINR,
        consultationType: appointment.consultationType,
        appointmentDate: appointment.appointmentDate,
        appointmentSlotId: appointment.appointmentSlotId,
        appointmentPaymentStatus: appointment.appointmentPaymentStatus,
        appointmentCreationTime: appointment.appointmentCreationTime,
        orderType: appointment.orderType,
        orderStatus: appointment.orderStatus,
        assistantId: appointment.assistantId,
        assistantAppointmentDate: 'NA',
        assistantAppointmentSlotId: 'NA',
        assistantConsecutiveBookedSlots: appointment.assistantConsecutiveBookedSlots,
        appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
        appointmentStatus: appointment.appointmentStatus,
        arhOrderId: appointment.arhOrderId,
        paymentMode: appointment.paymentMode,
        assistantNotRequired: appointment.assistantNotRequired,
		appointmentType: appointment.appointmentType
      });
    }
    msg.ack();
  }
};
