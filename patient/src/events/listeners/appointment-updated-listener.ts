import { appointmentUpdatedGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, AppointmentUpdatedEvent, Subjects, ChatGroupActionType, OrderStatus, EmailType, EmailTemplate, EmailDeliveryType, AppointmentUpdateType, UserType, SMSTemplate, SMSType, ConsultationType } from '@unifycaredigital/aem';
import { Appointment } from '../../models/appointment-order';
import { Patient } from '../../models/patient';
import { SendNewEmailPublisher } from '../publishers/send-new-email-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { UpdateAppointmentChatGroupPublisher } from '../publishers/update-appointment-chat-group-publisher';
import { AddNewAssistantInChatGroupPublisher } from '../publishers/add-new-assistant-in-chat-group-publisher';
import moment from 'moment';
import { Consultant } from '../../models/consultant';
import { SendNewSMSPublisher } from '../publishers/send-new-sms-publisher';

const REMINDER_WINDOW_SECONDS = 900;


export class AppointmentUpdatedListener extends Listener<AppointmentUpdatedEvent> {
  subject: Subjects.AppointmentUpdated = Subjects.AppointmentUpdated;
  queueGroupName = appointmentUpdatedGroupName;

  async onMessage(data: AppointmentUpdatedEvent['data'], msg: Message) {
    console.log('AppointmentUpdatedEvent Received for Update Type: ', data.updateType);

    let appointment = null;
    appointment = await Appointment.findById(data.appointmentId);
    let patient = await Patient.findById(data.customerId);
    if (!patient) {
      console.log("Patient not found for Id: " + data.customerId)
      msg.ack();
      return;
    }
    let remarks = '';
    let sendSystemMessage = false;
    const currentTime = String(moment().utcOffset(330).format('ddd DD-MMM-YYYY, hh:mm A'));
    const updation = new Date();

    updation.setSeconds(updation.getSeconds() + 200);

    if (appointment) {

      let assistantName = appointment.assistantName;

      if (data.updateType === AppointmentUpdateType.AssistantChanged) {

        const assistant = await Consultant.findById(data.assistantId);
        if (assistant) {
          assistantName = assistant.userFirstName;

          remarks = `New Physician Assistant ${assistantName} allocated.  ${currentTime}`;
          sendSystemMessage = true;

          ///// Publish Update Appointment Chat Group Message //////////////
          new AddNewAssistantInChatGroupPublisher(natsWrapper.client).publish({
            appointmentId: appointment.id!,
            assistantId: data.assistantId,
            assistantName: assistantName,
            assistantEmailId: assistant.emailId,
          });
        }
      }

      appointment.set({
        id: data.appointmentId,
        consultantId: data.consultantId,
        customerId: data.customerId,
        creatorId: data.creatorId,
        partnerId: data.partnerId,
        parentId: data.parentId,
        createdBy: data.createdBy,
        basePriceInINR: data.basePriceInINR,
        consultationType: data.consultationType,
        appointmentDate: data.appointmentDate,
        appointmentSlotId: data.appointmentSlotId,
        appointmentStatus: data.appointmentStatus,
        appointmentCreationTime: data.appointmentCreationTime,
        appointmentSummary: 'NA',
        orderType: data.orderType,
        orderStatus: data.orderStatus,
        assistantId: data.assistantId,
        assistantName: assistantName,
        assistantAppointmentDate: data.assistantAppointmentDate,
        assistantAppointmentSlotId: data.assistantAppointmentSlotId,
        assistantConsecutiveBookedSlots: data.assistantConsecutiveBookedSlots,
        appointmentRescheduleEnabled: data.appointmentRescheduleEnabled,
        appointmentPaymentStatus: data.appointmentPaymentStatus,
        arhOrderId: data.arhOrderId,
        paymentMode: data.paymentMode,
        assistantNotRequired: data.assistantNotRequired
      })
      await appointment.save();

      let name = appointment.consultantName;
      if (data.updatedBy === UserType.PhysicianAssistant) {
        name = appointment.assistantName;
      }

      if (data.updateType === AppointmentUpdateType.ReadyForDoctorConsultation) {
        remarks = `State changed to "Ready for consult" by ${name} ${currentTime}`;
        sendSystemMessage = true;
      } else if (data.updateType === AppointmentUpdateType.MarkForReschedule) {
        remarks = `Patient allowed to reschedule appointment by ${name} ${currentTime}`;
        sendSystemMessage = true;
      } else if (data.updateType === AppointmentUpdateType.Rescheduled) {
        let time = Math.floor(appointment.appointmentSlotId / 4);
        let suffix = "AM";
        if (time >= 12) {
          suffix = "PM";
        }
        if (time > 12) {
          time = time - 12;
        }
        let minutes = ((appointment.appointmentSlotId % 4) * 15);
        let minutesStr = "";
        if (minutes < 10) {
          minutesStr = minutesStr.concat(minutes.toString(), "0");
        } else {
          minutesStr = minutes.toString();
        }
        const makeInitialCapital = (str: any) => {
          let word = str.toLowerCase().split(" ");
          for (let i = 0; i < word.length; i++) {
            word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
          }
          return word.join(" ");
        };

        let ccmailIds = "";
        let consultantEmailId = 'NA';
        const appConsultant = await Consultant.findById(appointment.consultantId);
        if (appConsultant) {
          consultantEmailId = appConsultant.emailId;
          ccmailIds = consultantEmailId;
        }
        let assistantEmailId = 'NA';
        if (appointment.consultationType === ConsultationType.Diabetologist && appointment.assistantId !== 'NA') {
          const appAssistant = await Consultant.findById(appointment.assistantId);
          if (appAssistant) {
            assistantEmailId = appAssistant.emailId;
            ccmailIds = ccmailIds + "," + assistantEmailId;
          }
        }


        const timeStr = time + ":" + minutesStr + " " + suffix;
        const date = appointment.appointmentDate.split("-")[2] + "-" + appointment.appointmentDate.split("-")[1] + "-" + appointment.appointmentDate.split("-")[0];
        const emailBody = {
          patientFirstName: makeInitialCapital(patient.userFirstName),
          patientLastName: makeInitialCapital(patient.userLastName),
          doctorName: appointment.consultantName,
          docotrType: makeInitialCapital(appointment.consultationType),
          rescheduleDate: date,
          rescheduleTime: timeStr,
        }

        const objJson = JSON.stringify(emailBody);
        ccmailIds = ccmailIds + "," + String(process.env.SYSTEM_RECEIVER_EMAIL_ID);
        //////// Send Email to  Patient 
        new SendNewEmailPublisher(natsWrapper.client).publish({
          to: patient.emailId,
          cc: '',
          bcc: ccmailIds,
          from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
          subject: 'Appointment Reschedule',
          body: objJson,
          emailType: EmailType.HtmlText,
          emailTemplate: EmailTemplate.AppointmentReschedule,
          emaiDeliveryType: EmailDeliveryType.Immediate,
          atExactTime: new Date()
        });

        const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
          "&To=" + patient.phoneNumber +
          "&TemplateName=" + SMSTemplate.RESCHEDULE_BOOKING_DETAILS +
          "&VAR1=" + appointment.customerFirstName + " " + appointment.customerLastName +
          "&VAR2=" + appointment.consultantName + " on " + date + " at " + timeStr + ".";

        new SendNewSMSPublisher(natsWrapper.client).publish({
          to: patient.phoneNumber,
          body: smsBody,
          smsType: SMSType.Transactional,
          smsTemplate: SMSTemplate.BOOKING_DETAILS,
          generatedAt: new Date(),
        });

        const year = Number(moment(appointment.appointmentDate).utcOffset(330).format('YYYY'));
        // 0 is Jan , 11 is Dec when use in Date, where as for moment 1 is Jan, 12 is Dec
        const month = Number(moment(appointment.appointmentDate).utcOffset(330).format('MM')) - 1;
        const day = Number(moment(appointment.appointmentDate).utcOffset(330).format('DD'));

        let hour = Math.trunc(appointment.appointmentSlotId / 4);


        let reminderDate = new Date(year, month, day, hour, minutes, 0, 0);

        reminderDate.setSeconds(reminderDate.getSeconds() - REMINDER_WINDOW_SECONDS);

        console.log('Reschedule Reminder Time: ' + reminderDate + " for Appointment at: " + appointment.appointmentDate + " " + hour + ":" + minutes);

        const currentTime = String(moment().utcOffset(330).format('ddd DD-MMM-YYYY, hh:mm A'));
        if (appointment.consultationType === ConsultationType.Diabetologist) {
          remarks = `Appointment rescheduled with ${appointment.consultantName} \n(Physician Assistant :${appointment.assistantName}) ${currentTime}`;
        } else {
          remarks = `Appointment rescheduled with ${appointment.consultantName} \n${currentTime}`;
        }


        ///// Publish Update Appointment Chat Group Message //////////////
        new UpdateAppointmentChatGroupPublisher(natsWrapper.client).publish({
          appointmentId: appointment.id!,
          patientId: appointment.customerId,
          consultantId: appointment.consultantId,
          appointmentDate: appointment.appointmentDate,
          assistantId: appointment.assistantId,
          appointmentSlotId: appointment.appointmentSlotId,
          remarks: remarks,
          chatGroupAction: ChatGroupActionType.ADDCHATGROUP,
          updateChatGroupAtTime: reminderDate,
          parentId: appointment.parentId,
          patientName: appointment.parentName,
          consultantName: appointment.consultantName,
          assistantName: appointment.assistantName,
          parentName: appointment.parentName,
          parentEmailId: patient.emailId,
          consultantEmailId: consultantEmailId,
          assistantEmailId: assistantEmailId,
        });
      } else if (data.updateType === AppointmentUpdateType.AssistantChanged) {
        let consultantEmailId = 'NA';
        const appConsultant = await Consultant.findById(appointment.consultantId);
        if (appConsultant) {
          consultantEmailId = appConsultant.emailId;
        }
        let assistantEmailId = 'NA';
        if (appointment.consultationType === ConsultationType.Diabetologist && appointment.assistantId !== 'NA') {
          const appAssistant = await Consultant.findById(appointment.assistantId);
          if (appAssistant) {
            assistantEmailId = appAssistant.emailId;
          }
        }
        remarks = `New Physician Assistant: ${appointment.assistantName} allocated \n${currentTime}`;
        sendSystemMessage = true;
        new AddNewAssistantInChatGroupPublisher(natsWrapper.client).publish({
          appointmentId: appointment.id!,
          assistantId: appointment.assistantId,
          assistantName: appointment.assistantName,
          assistantEmailId: assistantEmailId
        });
      }

      if (sendSystemMessage) {
        console.log('Sending System Message: ' + remarks);
        ///// Publish Update Appointment Chat Group Message //////////////
        new UpdateAppointmentChatGroupPublisher(natsWrapper.client).publish({
          appointmentId: appointment.id!,
          patientId: appointment.customerId,
          consultantId: appointment.consultantId,
          appointmentDate: appointment.appointmentDate,
          assistantId: appointment.assistantId,
          appointmentSlotId: appointment.appointmentSlotId,
          remarks: remarks,
          chatGroupAction: ChatGroupActionType.ADDSYSTEMMESSAGE,
          updateChatGroupAtTime: updation,
          parentId: appointment.parentId,
          patientName: appointment.parentName,
          consultantName: appointment.consultantName,
          assistantName: appointment.assistantName,
          parentName: appointment.parentName,
          parentEmailId: 'NA',
          consultantEmailId: 'NA',
          assistantEmailId: 'NA',
        });
      }
    }

    msg.ack();


  }
}
