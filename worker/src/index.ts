import { natsWrapper } from './nats-wrapper';
import { OTPCreatedListener } from './events/listeners/otp-created-listener';
import { SendNewEmailListener } from './events/listeners/send-new-email-listener';
import { SendNewSMSListener } from './events/listeners/send-new-sms-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { backupDatabaseQueue } from './queues/database-backup-queue';
import { uploadDatabaseQueue } from './queues/database-upload-queue';
import { addConsultantAppointmentSlotsQueue } from './queues/add-consultant-appointment-slots-queue';
import { UpdateAppointmentChatGroupListener } from './events/listeners/update-appointment-chat-group-listener';
import { AppointmentRescheduleEnabledListner } from './events/listeners/appointment-rescheduled-enabled-listener';
import { SendNotificationListener } from './events/listeners/send-notification-listener';
import { app } from './app';
import { followupReminderQueue } from './queues/followup-reminder-queue';
import { FollowupReminderType } from '@unifycaredigital/aem';

const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.LOCAL_BACKUP_DIRECTORY) {
    throw new Error('LOCAL_BACKUP_DIRECTORY must be defined');
  }
  if (!process.env.SERVER_BACKUP_DIRECTORY) {
    throw new Error('SERVER_BACKUP_DIRECTORY must be defined');
  }
  // if (!process.env.EMAIL_DELIVERY_KEY) {
  //   throw new Error('EMAIL_DELIVERY_KEY must be defined');
  // }
  // if (!process.env.SMS_DELIVERY_KEY) {
  //   throw new Error('SMS_DELIVERY_KEY must be defined');
  // }
  if (!process.env.SYSTEM_SENDER_FULL_NAME) {
    throw new Error('SYSTEM_SENDER_FULL_NAME must be defined');
  }
  if (!process.env.SYSTEM_SENDER_EMAIL_ID) {
    throw new Error('SYSTEM_SENDER_EMAIL_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OTPCreatedListener(natsWrapper.client).listen();
    new SendNewEmailListener(natsWrapper.client).listen();
    new SendNewSMSListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
    new UpdateAppointmentChatGroupListener(natsWrapper.client).listen();
    new AppointmentRescheduleEnabledListner(natsWrapper.client).listen();
    new SendNotificationListener(natsWrapper.client).listen();
    // these cron time is in UTC not in IST
    await followupReminderQueue.add({ followupReminderType: FollowupReminderType.Today }, { repeat: { cron: '0 7 * * *' } });

    await followupReminderQueue.add({ followupReminderType: FollowupReminderType.SevenDaysBefore }, { repeat: { cron: '0 10 * * *' } });

    await followupReminderQueue.add({ followupReminderType: FollowupReminderType.ThreeDaysBefore }, { repeat: { cron: '30 10 * * *' } });

    //await backupDatabaseQueue.add({ id: 'dataBackupJob' }, { repeat: { cron: '0 1 * * *' } });

    //await uploadDatabaseQueue.add({ id: 'dataUploadJob' }, { repeat: { cron: '15 1 * * *' } });

    await addConsultantAppointmentSlotsQueue.add({ message: 'Updating next slots' }, { repeat: { cron: '30 1 * * *' } });

  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!');
  });
};

start();
