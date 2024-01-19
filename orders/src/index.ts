import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { DatabaseBackupListener } from './events/listeners/database-backup-listener';
import { DatabaseUploadListener } from './events/listeners/database-upload-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderExpiredListener } from './events/listeners/order-expired-listener';
import { Counter } from './models/counter';
import { PingListener } from './events/listeners/ping-listener';
import { Liveness } from './models/liveness';

const start = async () => {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET must be defined');
  }
  if (!process.env.RAZORPAY_API_KEY) {
    throw new Error('RAZORPAY_API_KEY must be defined');
  }
  if (!process.env.RAZORPAY_API_SECRET) {
    throw new Error('RAZORPAY_API_SECRET must be defined');
  }
  if (!process.env.APPOINTMENT_RAZORPAY_API_KEY) {
    throw new Error('APPOINTMENT_RAZORPAY_API_KEY must be defined');
  }
  if (!process.env.APPOINTMENT_RAZORPAY_API_SECRET) { 
    throw new Error('APPOINTMENT_RAZORPAY_API_SECRET must be defined');
  }
  if (!process.env.PHARMACY_RAZORPAY_API_KEY) {
    throw new Error('PHARMACY_RAZORPAY_API_KEY must be defined');
  }
  if (!process.env.PHARMACY_RAZORPAY_API_SECRET) {
    throw new Error('PHARMACY_RAZORPAY_API_SECRET must be defined');
  }
  if (!process.env.TESTLAB_RAZORPAY_API_KEY) {
    throw new Error('TESTLAB_RAZORPAY_API_KEY must be defined');
  }
  if (!process.env.TESTLAB_RAZORPAY_API_SECRET) {
    throw new Error('TESTLAB_RAZORPAY_API_SECRET must be defined');
  }
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

    new DatabaseBackupListener(natsWrapper.client).listen();
    new DatabaseUploadListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderExpiredListener(natsWrapper.client).listen();
    new PingListener(natsWrapper.client).listen();

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

    let counter = await Counter.findOne({ _id: 'arhorderId' });
    if (!counter) {
      const counter = Counter.build({
        _id: 'arhorderId',
        sequence_value: 1
      });
      await counter.save()
    }
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
  });
};

start();
