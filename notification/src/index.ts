import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { AddChatGroupListener } from './events/listeners/add-chat-group-listener';
import { RemoveChatGroupListener } from './events/listeners/remove-chat-group-listener';
import { AppointmentBookedListener } from './events/listeners/appointment-booked-listener';
import { AddSystemMessageInChatGroupListener } from './events/listeners/add-system-message-in-chat-listener';
import { ConsultantCreatedListener } from './events/listeners/consultant-created-listener';
import { PatientCreatedListener } from './events/listeners/patient-created-listener';
import { ConsultantInfoUpdatedListener } from './events/listeners/consultant-info-updated-listener';
import { PingListener } from './events/listeners/ping-listener';
import { AddNewAssistantInChatGroupListener } from './events/listeners/add-new-assistant-in-chat-group-listener';
import { Liveness } from './models/liveness';
import { DatabaseBackupListener } from './events/listeners/database-backup-listener';
import { DatabaseUploadListener } from './events/listeners/database-upload-listener';
import { AppointmentUpdatedListener } from './events/listeners/appointment-updated-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.DATABACKUP_TAR_FILENAME) {
    throw new Error('DATABACKUP_TAR_FILENAME must be defined');
  }
  if (!process.env.FIREBASE_DATABASE_URL) {
    throw new Error('FIREBASE_DATABASE_URL must be defined');
  }
  if (!process.env.AGORA_APP_ID) {
    throw new Error('AGORA_APP_ID must be defined');
  }
  if (!process.env.AGORA_APP_CERTIFICATE) {
    throw new Error('AGORA_APP_CERTIFICATE must be defined');
  }
  if (!process.env.GCM_API_KEY) {
    throw new Error('GCM_API_KEY must be defined');
  }
  if (!process.env.PUBLIC_VAPID_KEY) {
    throw new Error('PUBLIC_VAPID_KEY must be defined');
  }
  if (!process.env.PRIVATE_VAPID_KEY) {
    throw new Error('PRIVATE_VAPID_KEY must be defined');
  }
  if (!process.env.DEPLOYMENT_URL) {
    throw new Error('DEPLOYMENT_URL must be defined');
  }
  if (!process.env.SYSTEM_SENDER_EMAIL_ID) {
    throw new Error('SYSTEM_SENDER_EMAIL_ID must be defined');
  }
  if (!process.env.SYSTEM_SENDER_FULL_NAME) {
    throw new Error('SYSTEM_SENDER_FULL_NAME must be defined');
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

    new RemoveChatGroupListener(natsWrapper.client).listen();
    new AddChatGroupListener(natsWrapper.client).listen();
    new AppointmentBookedListener(natsWrapper.client).listen();
    new AddSystemMessageInChatGroupListener(natsWrapper.client).listen();
    new ConsultantCreatedListener(natsWrapper.client).listen();
    new PatientCreatedListener(natsWrapper.client).listen();
    new ConsultantInfoUpdatedListener(natsWrapper.client).listen();
    new PingListener(natsWrapper.client).listen();
    new AddNewAssistantInChatGroupListener(natsWrapper.client).listen();
    new DatabaseBackupListener(natsWrapper.client).listen();
    new DatabaseUploadListener(natsWrapper.client).listen();
    new AppointmentUpdatedListener(natsWrapper.client).listen();


    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDb');

    let liveness = await Liveness.findOne({});
    if (!liveness) {
      liveness = Liveness.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        currentSerialNumber: 0,
        oldSerialNumber: 0,
        pingCount: 0
      });
      await liveness.save()
    }
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
  });
};

start();
