import Queue from 'bull';
import { AppointmentReminderPublisher } from '../events/publishers/appointment-reminder-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  appointmentId: string;
}

const appointmentReminderQueue = new Queue<Payload>('appointment:reminder', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

appointmentReminderQueue.process((job, done) => {
  new AppointmentReminderPublisher(natsWrapper.client).publish({
    appointmentId: job.data.appointmentId,
  });
  done();
});

export { appointmentReminderQueue };
