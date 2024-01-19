import { appointmentRecheduleEnabledGroupName } from './queue-group-name';
import { appointmentRescheduleExpirationQueue } from '../../queues/appointment-reschedule-expiration-queue';
import { Message } from 'node-nats-streaming';
import { Listener, AppointmentRescheduleEnabledEvent, Subjects } from '@unifycaredigital/aem';

export class AppointmentRescheduleEnabledListner extends Listener<AppointmentRescheduleEnabledEvent> {
  subject: Subjects.AppointmentRescheduleEnabled = Subjects.AppointmentRescheduleEnabled;
  queueGroupName = appointmentRecheduleEnabledGroupName;

  async onMessage(data: AppointmentRescheduleEnabledEvent['data'], msg: Message) {

    const delay = new Date(data.expirationDate).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process OTP:', delay);

    if (delay < 0) {
      msg.ack();
      return
    }

    try {
      await appointmentRescheduleExpirationQueue.add(
        {
          appointmentId: data.appointmentId,
          serialNumber: data.serialNumber,
        },
        {
          delay,
        }
      );
      msg.ack();
    } catch (error) {
      msg.ack();
      console.error(error);
    }
    msg.ack();
  }
}
