import { appointmentCompletedGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, AppointmentCompletedEvent, Subjects, AppointmentStatus } from '@unifycaredigital/aem';
import { Appointment } from '../../models/appointment';

export class AppointmentCompletedListener extends Listener<AppointmentCompletedEvent> {
  subject: Subjects.AppointmentCompleted = Subjects.AppointmentCompleted;
  queueGroupName = appointmentCompletedGroupName;

  async onMessage(data: AppointmentCompletedEvent['data'], msg: Message) {

    const appointment = await Appointment.findById(data.appointmentId);
    if (!appointment) {
      console.log("appointment Not found for Id: " + data.appointmentId)
      msg.ack();
      return;
    } else {
      if (appointment.appointmentStatus === AppointmentStatus.SuccessfullyCompleted
        || appointment.appointmentStatus === AppointmentStatus.CompletedWithError) {
        msg.ack();
        return;
      }
      console.log("appointment found for Id: " + data.appointmentId + "; Status: " + appointment.appointmentStatus)
      let appointmentStatus = AppointmentStatus.SuccessfullyCompleted;

      if (!data.successfullyCompleted) {
        appointmentStatus = AppointmentStatus.CompletedWithError;
      }
      appointment.set({
        lastAppointmentStatus: appointment.appointmentStatus,
        appointmentStatus: appointmentStatus,
      });
      await appointment.save();
    }
    msg.ack();
  }
}
