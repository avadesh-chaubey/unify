import Queue from 'bull';
import { OTPExpirationPublisher } from '../events/publishers/otp-expiration-publisher';
import { natsWrapper } from '../nats-wrapper';
import { OTPType } from '@unifycaredigital/aem'

interface Payload {
  id: string;
  serialNumber: number;
  otpType: OTPType;
}

const otpExpirationQueue = new Queue<Payload>('otp:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

otpExpirationQueue.process((job, done) => {
  new OTPExpirationPublisher(natsWrapper.client).publish({
    id: job.data.id,
    serialNumber: job.data.serialNumber,
    otpType: job.data.otpType,
  });
  done();
});

export { otpExpirationQueue };
