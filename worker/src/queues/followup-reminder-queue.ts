import { FollowupReminderType } from '@unifycaredigital/aem';
import Queue from 'bull';
import { FollowupReminderPublisher } from '../events/publishers/followup-reminder-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  followupReminderType: FollowupReminderType;
}

const followupReminderQueue = new Queue<Payload>('followup:reminder', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

followupReminderQueue.process((job, done) => {
  new FollowupReminderPublisher(natsWrapper.client).publish({
    followupReminderType: job.data.followupReminderType,
  });
  done();
});

export { followupReminderQueue };
