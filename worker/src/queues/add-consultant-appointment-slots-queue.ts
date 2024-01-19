import Queue from 'bull';
import { AddConsultantAppointmentSlotsPublisher } from '../events/publishers/add-consultant-appointment-slots-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  message: string;
}

const addConsultantAppointmentSlotsQueue = new Queue<Payload>('consultant:appointment:slots', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

addConsultantAppointmentSlotsQueue.process((job, done) => {
  new AddConsultantAppointmentSlotsPublisher(natsWrapper.client).publish({
    message: job.data.message,
  });
  done();
});

export { addConsultantAppointmentSlotsQueue };
