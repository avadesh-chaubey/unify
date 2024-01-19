import { appointmentcancelGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, AppointmentCancelEvent, Subjects, AppointmentStatus } from '@unifycaredigital/aem';
import { Appointment } from '../../models/appointment';

export class AppointmentCancelListener extends Listener<AppointmentCancelEvent> {
  subject: Subjects.AppointmentCancelled = Subjects.AppointmentCancelled;
  queueGroupName = appointmentcancelGroupName;

  async onMessage(data: AppointmentCancelEvent['data'], msg: Message) {

    let appointment = await Appointment.findOne({ id: data.appointmentId });
    if (!appointment) {
      console.log("appointment Not found for Id: " + data.appointmentId)
      msg.ack();
      return;
    }
    appointment.set({
      lastAppointmentStatus: appointment.appointmentStatus,
      appointmentStatus: AppointmentStatus.Cancelled,
    });
    await appointment.save();

    msg.ack();
  }
}
