import { Listener, Subjects, OrderUpdatedEvent, AppointmentPaymentStatus, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { Appointment } from '../../models/appointment';
import { AppointmentConfig } from '../../models/appointment-config';
import { orderUpdatedGroupName } from './queue-group-name';

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
  queueGroupName = orderUpdatedGroupName;

  async onMessage(data: OrderUpdatedEvent['data'], msg: Message) {
    console.log('OrderUpdatedEvent for id: ', data.productId);

    const appointment = await Appointment.findById(data.productId);
    if (!appointment) {
      msg.ack();
      return;
    }
    const appointmentTrack = {
      stateUpdateTime: new Date(),
      state: AppointmentPaymentStatus.Created,
      appointmentDate: appointment.appointmentDate,
      appointmentSlotId: String(appointment.appointmentSlotId),
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: UserType.Patient,
    }

    const assistantAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: appointment.appointmentStatus,
      appointmentDate: appointment.assistantAppointmentDate,
      appointmentSlotId: String(appointment.assistantAppointmentSlotId),
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: UserType.Patient,
    }

    const appList = [...appointment.appointmentTimeLine];
    appList.push(appointmentTrack);

    const assistantAppList = [...appointment.assistantAppointmentTimeLine];
    assistantAppList.push(assistantAppointmentTrack);

    if (appointment.appointmentPaymentStatus === AppointmentPaymentStatus.Blocked) {
      appointment.set({
        assistantAppointmentTimeLine: assistantAppList,
        appointmentTimeLine: appList,
        appointmentPaymentStatus: AppointmentPaymentStatus.Created,
      });
      await appointment.save();
    }
    msg.ack();
  }
};
