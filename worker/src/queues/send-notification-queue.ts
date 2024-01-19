import Queue from 'bull';
import { NotificationType } from '@unifycaredigital/aem';
import { push } from '../push';

var request = require('request');


interface Payload {
  notification: Object,
  type: NotificationType,
  registrationIOSIds: [string]
}

const sendNotificationQueue = new Queue<Payload>('notification:service', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

sendNotificationQueue.process(async (job, done) => {
if(job.data.type === NotificationType.VoipCall){
  const iosResult = await push.send(job.data.registrationIOSIds, job.data.notification);
  console.log("Worker iosResult: " + iosResult);
} else {
  request(job.data.notification, function (error: any, response: any) {
    if (error) throw new Error(error);
    console.log(new Date() + " " + response.body);
  });
}

  console.log(job.data);
  done();
});

export { sendNotificationQueue };
