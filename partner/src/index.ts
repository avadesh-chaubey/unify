import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { DatabaseBackupListener } from './events/listeners/database-backup-listener';
import { DatabaseUploadListener } from './events/listeners/database-upload-listener';
import { PingListener } from './events/listeners/ping-listener';
import { Liveness } from './models/liveness';
import { PatientCreatedListener } from './events/listeners/patient-created-listener';
import { AppointmentBookedListener } from './events/listeners/appointment-booked-listener';
import { AppointmentCancelListener } from './events/listeners/appointment-cancel-listener';
import { AppointmentCompletedListener } from './events/listeners/appointment-completed-listener';
import { FamilyMemberCreatedListener } from './events/listeners/family-member-created-listener';

const start = async () => {
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
  if (!process.env.DEPLOYMENT_URL) {
    throw new Error('DEPLOYMENT_URL must be defined');
  }
  if (!process.env.SYSTEM_SENDER_EMAIL_ID) {
    throw new Error('SYSTEM_SENDER_EMAIL_ID must be defined');
  }
  if (!process.env.SYSTEM_SENDER_FULL_NAME) {
    throw new Error('SYSTEM_SENDER_FULL_NAME must be defined');
  }
  if (!process.env.SYSTEM_SMS_SENDER_ID) {
    throw new Error('SYSTEM_SMS_SENDER_ID must be defined');
  }
  if (!process.env.MASTER_ROSTER_EMAIL_ID) {
    throw new Error('MASTER_ROSTER_EMAIL_ID must be defined');
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

    new UserCreatedListener(natsWrapper.client).listen();
    new DatabaseBackupListener(natsWrapper.client).listen();
    new DatabaseUploadListener(natsWrapper.client).listen();
    new PingListener(natsWrapper.client).listen();
    new PatientCreatedListener(natsWrapper.client).listen();
    new AppointmentBookedListener(natsWrapper.client).listen();
    new AppointmentCancelListener(natsWrapper.client).listen();
    new AppointmentCompletedListener(natsWrapper.client).listen();
    new FamilyMemberCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
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
    console.log('Listening on port 3000!!!!');
  });
};

start();
