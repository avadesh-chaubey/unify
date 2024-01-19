import Queue from 'bull';
import { AppointmentRescheduleExpirationPublisher } from '../events/publishers/appointment-reschedule-expiration-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  appointmentId: string;
  serialNumber: number;
}

const appointmentRescheduleExpirationQueue = new Queue<Payload>('appointment:reschedule:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

appointmentRescheduleExpirationQueue.process((job, done) => { 
  new AppointmentRescheduleExpirationPublisher(natsWrapper.client).publish({
    appointmentId: job.data.appointmentId,
    serialNumber: job.data.serialNumber,
  });
  done();
});

export { appointmentRescheduleExpirationQueue };
