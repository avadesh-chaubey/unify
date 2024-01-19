import Queue from 'bull';
import { SMSType, SMSTemplate } from '@unifycaredigital/aem'

const url = process.env.SMS_DELIVERY_KEY;

interface Payload {
  to: string;
  body: string;
  smsType: SMSType;
  smsTemplate: SMSTemplate;
  generatedAt: Date;
}

const sendNewSMSQueue = new Queue<Payload>('sms:delivery:service', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

sendNewSMSQueue.process(async (job, done) => {

  const axios = require('axios');
  try {
    const response = await axios.post(url, job.data.body);
    console.log(new Date() + " " + response.data);
  } catch (exception) {
    console.error(`ERROR received from ${url}: ${exception}\n`);
  }
  done();
});


export { sendNewSMSQueue };
