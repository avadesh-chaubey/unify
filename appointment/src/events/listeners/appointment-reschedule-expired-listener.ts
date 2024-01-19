import { Listener, AppointmentRescheduleExpiredEvent, Subjects, UserType, SlotAvailability, AppointmentStatus } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { Appointment } from '../../models/appointment';
import { AppointmentConfig } from '../../models/appointment-config';
import { appointmentRescheduleExpiredGroupName } from './queue-group-name';
import { AppointmentCompletedPublisher } from '../publishers/appointment-completed-publisher';
import { natsWrapper } from '../../nats-wrapper';
import moment from 'moment';

export class AppointmentRescheduleExpiredListener extends Listener<AppointmentRescheduleExpiredEvent> {
  subject: Subjects.AppointmentRescheduleExpired = Subjects.AppointmentRescheduleExpired;
  queueGroupName = appointmentRescheduleExpiredGroupName;

  async onMessage(data: AppointmentRescheduleExpiredEvent['data'], msg: Message) {
    console.log('AppointmentExpiredEvent for id: ', data.appointmentId);

    const appointment = await Appointment.findById(data.appointmentId);
    if (!appointment) {
      console.log('Apppointment Not Found for Id: ', data.appointmentId);
      msg.ack();
      return;
    }

    if (appointment.rescheduleSerialNumber != data.serialNumber) {
      msg.ack();
      return;
    }

    if (!appointment.appointmentRescheduleEnabled) {
      msg.ack();
      return;
    }

    const appointmentTrack = {
      stateUpdateTime: new Date(),
      state: appointment.appointmentPaymentStatus,
      appointmentDate: appointment.appointmentDate,
      appointmentSlotId: String(appointment.appointmentSlotId),
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: UserType.System,
    }

    const assistantAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: AppointmentStatus.CompletedWithError,
      appointmentDate: appointment.assistantAppointmentDate,
      appointmentSlotId: String(appointment.assistantAppointmentSlotId),
      appointmentRescheduleEnabled: false,
      updatedBy: UserType.System,
    }

    const appList = [...appointment.appointmentTimeLine];
    appList.push(appointmentTrack);

    const assistantAppList = [...appointment.assistantAppointmentTimeLine];
    assistantAppList.push(assistantAppointmentTrack);

    appointment.set({
      assistantAppointmentTimeLine: assistantAppList,
      appointmentTimeLine: appList,
      appointmentStatus: AppointmentStatus.CompletedWithError,
      appointmentRescheduleEnabled: false,
    });
    await appointment.save();

    const existingAppointmentConfig = await AppointmentConfig.findOne({
      consultantId: appointment.consultantId,
      appointmentDate: appointment.appointmentDate
    });

    if (!existingAppointmentConfig) {
      //This is not possible
      console.log('Apppointment Config Not found for Consultant Id: ', appointment.consultantId);
      msg.ack();
      return;
    }
    if (existingAppointmentConfig.availableSlots[appointment.appointmentSlotId] === SlotAvailability.Blocked) {
      const newList = [...existingAppointmentConfig.availableSlots];
      newList[appointment.appointmentSlotId] = SlotAvailability.Available;
      existingAppointmentConfig.set({
        availableSlots: newList,
      });
      await existingAppointmentConfig.save();
    }

    ///// Publish New Appointment Message //////////////
    new AppointmentCompletedPublisher(natsWrapper.client).publish({
      appointmentId: appointment.id!,
      successfullyCompleted: false,
      remarks: 'Patient No Show',
      followupConsultationDate: new Date(),
      updatedBy: UserType.System
    });

    msg.ack();
  }
};
