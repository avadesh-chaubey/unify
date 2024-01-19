import { sendNewSMSGroupName } from './queue-group-name';
import { sendNewSMSQueue } from '../../queues/send-new-sms-queue';
import { Message } from 'node-nats-streaming';
import { Listener, sendNewSMSEvent, Subjects, SMSType, SMSTemplate } from '@unifycaredigital/aem';

export class SendNewSMSListener extends Listener<sendNewSMSEvent> {
  subject: Subjects.SendNewSMS = Subjects.SendNewSMS;
  queueGroupName = sendNewSMSGroupName;

  async onMessage(data: sendNewSMSEvent['data'], msg: Message) {

    let delay = new Date(data.generatedAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process OTP:', delay);

    //see if message is already 10 min delayed
    if ((delay + 600000) < 0) {
      msg.ack();
      return;
    }

    delay = 1000; //fixing to 1 sec for now


    try {
      await sendNewSMSQueue.add({
        to: data.to,
        body: data.body,
        smsType: SMSType.Transactional,
        smsTemplate: data.smsTemplate,
        generatedAt: data.generatedAt,
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
