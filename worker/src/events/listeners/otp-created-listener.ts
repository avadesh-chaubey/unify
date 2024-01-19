import { otpCreatedGroupName } from './queue-group-name';
import { otpExpirationQueue } from '../../queues/otp-expiration-queue';
import { Message } from 'node-nats-streaming';
import { Listener, OTPCreatedEvent, Subjects } from '@unifycaredigital/aem';

export class OTPCreatedListener extends Listener<OTPCreatedEvent> {
  subject: Subjects.OTPCreated = Subjects.OTPCreated;
  queueGroupName = otpCreatedGroupName;

  async onMessage(data: OTPCreatedEvent['data'], msg: Message) {

    const delay = new Date(data.expirationDate).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process OTP:', delay);

    if (delay < 0) {
      msg.ack();
      return
    }

    try {
      await otpExpirationQueue.add(
        {
          id: data.id,
          otpType: data.otpType,
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
