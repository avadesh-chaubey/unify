import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderExpiredListener } from './events/listeners/order-expired-listener'
import { PaymentCompletedListener } from './events/listeners/payment-completed-listener'
import { DatabaseBackupListener } from './events/listeners/database-backup-listener';
import { DatabaseUploadListener } from './events/listeners/database-upload-listener';
import { AddConsultantAppointmentSlotsListener } from './events/listeners/add-consultant-appointment-slots-listener';
import { ConsultantCreatedListener } from './events/listeners/consultant-created-listener';
import { AppointmentRescheduleExpiredListener } from './events/listeners/appointment-reschedule-expired-listener';
import { ConsultantInfoUpdatedListener } from './events/listeners/consultant-info-updated-listener';
import { Liveness } from './models/liveness';
import { PingListener } from './events/listeners/ping-listener';
import { OrderUpdatedListener } from './events/listeners/order-updated-listener';
import { PartnerEmployeeCreatedListener } from './events/listeners/partner-employee-created-listener';
import { PartnerInformationCreatedListener } from './events/listeners/partner-information-created-listener';
import { PartnerInformationUpdatedListener } from './events/listeners/partner-information-updated-listener';

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

    new OrderExpiredListener(natsWrapper.client).listen();
    new PaymentCompletedListener(natsWrapper.client).listen();
    new DatabaseBackupListener(natsWrapper.client).listen();
    new DatabaseUploadListener(natsWrapper.client).listen();
    new ConsultantCreatedListener(natsWrapper.client).listen();
    new AddConsultantAppointmentSlotsListener(natsWrapper.client).listen();
    new AppointmentRescheduleExpiredListener(natsWrapper.client).listen();
    new ConsultantInfoUpdatedListener(natsWrapper.client).listen();
    new PingListener(natsWrapper.client).listen();
    new OrderUpdatedListener(natsWrapper.client).listen();
    new PartnerEmployeeCreatedListener(natsWrapper.client).listen();
    new PartnerInformationCreatedListener(natsWrapper.client).listen();
    new PartnerInformationUpdatedListener(natsWrapper.client).listen();

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
    console.log('Listening on port 3000!!!');
  });
};

start();
