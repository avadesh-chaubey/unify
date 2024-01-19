import { Listener, AppointmentExpiredEvent, Subjects, OrderExpiredEvent, SlotAvailability, AppointmentPaymentStatus, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { Appointment } from '../../models/appointment';
import { AppointmentConfig } from '../../models/appointment-config';
import { orderExpiredGroupName } from './queue-group-name';

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
  subject: Subjects.OrderExpired = Subjects.OrderExpired;
  queueGroupName = orderExpiredGroupName;

  async onMessage(data: OrderExpiredEvent['data'], msg: Message) {
    console.log('OrderExpiredEvent for id: ', data.productId);

    const appointment = await Appointment.findById(data.productId);
    if (!appointment) {
      msg.ack();
      return;
    }
    const appointmentTrack = {
      stateUpdateTime: new Date(),
      state: AppointmentPaymentStatus.Expired,
      appointmentDate: appointment.appointmentDate,
      appointmentSlotId: String(appointment.appointmentSlotId),
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: UserType.System,
    }

    const assistantAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: appointment.appointmentStatus,
      appointmentDate: appointment.assistantAppointmentDate,
      appointmentSlotId: String(appointment.assistantAppointmentSlotId),
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: UserType.System,
    }

    const appList = [...appointment.appointmentTimeLine];
    appList.push(appointmentTrack);

    const assistantAppList = [...appointment.assistantAppointmentTimeLine];
    assistantAppList.push(assistantAppointmentTrack);

    if (appointment.appointmentPaymentStatus === AppointmentPaymentStatus.Blocked || appointment.appointmentPaymentStatus === AppointmentPaymentStatus.Created) {
      appointment.set({
        assistantAppointmentTimeLine: assistantAppList,
        appointmentTimeLine: appList,
        appointmentPaymentStatus: AppointmentPaymentStatus.Expired,
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
      console.log('Apppointment Config found for Consultant Id: ', appointment.consultantId);
      console.log('Apppointment Config for slotId: ' + appointment.appointmentSlotId + ', is: ' + existingAppointmentConfig.availableSlots[appointment.appointmentSlotId]);
      if (existingAppointmentConfig.availableSlots[appointment.appointmentSlotId] === SlotAvailability.Blocked) {
        const newList = [...existingAppointmentConfig.availableSlots];
        console.log('availableSlots: ', newList);
        console.log('appointment.appointmentSlotId: ', appointment.appointmentSlotId);
        newList[appointment.appointmentSlotId] = SlotAvailability.Available;
        existingAppointmentConfig.set({
          availableSlots: newList,
        });
        existingAppointmentConfig.markModified('availableSlots');
        await existingAppointmentConfig.save();
      }
    }
    msg.ack();
  }
};
