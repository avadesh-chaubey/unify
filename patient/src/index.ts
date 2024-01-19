import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { PatientCreatedListener } from './events/listeners/patient-created-listener';
import { AppointmentBookedListener } from './events/listeners/appointment-booked-listener';
import { AppointmentUpdatedListener } from './events/listeners/appointment-updated-listener';
import { AppointmentCancelListener } from './events/listeners/appointment-cancel-listener';
import { AppointmentCompletedListener } from './events/listeners/appointment-completed-listener';
import { DatabaseBackupListener } from './events/listeners/database-backup-listener';
import { DatabaseUploadListener } from './events/listeners/database-upload-listener';
import { ConsultantCreatedListener } from './events/listeners/consultant-created-listener';
import { FixedPrice } from './models/fixed-price';
import { AppointmentReminderListener } from './events/listeners/appointment-reminder-listener';
import { PaymentCompletedListener } from './events/listeners/payment-completed-listener';
import { ConsultantInfoUpdatedListener } from './events/listeners/consultant-info-updated-listener';
import { PingListener } from './events/listeners/ping-listener';
import { Liveness } from './models/liveness';
import { FollowupReminderListener } from './events/listeners/followup-reminder-listener';
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
  if (!process.env.DEPLOYMENT_URL) {
    throw new Error('DEPLOYMENT_URL must be defined');
  }
  if (!process.env.SYSTEM_SENDER_EMAIL_ID) {
    throw new Error('SYSTEM_SENDER_EMAIL_ID must be defined');
  }
  if (!process.env.SYSTEM_SENDER_FULL_NAME) {
    throw new Error('SYSTEM_SENDER_FULL_NAME must be defined');
  }
  if (!process.env.MASTER_ROSTER_EMAIL_ID) {
    throw new Error('MASTER_ROSTER_EMAIL_ID must be defined');
  }
  if (!process.env.SYSTEM_SMS_SENDER_ID) {
    throw new Error('SYSTEM_SMS_SENDER_ID must be defined');
  }
  if (!process.env.SYSTEM_RECEIVER_EMAIL_ID) {
    throw new Error('SYSTEM_RECEIVER_EMAIL_ID must be defined');
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

    new PatientCreatedListener(natsWrapper.client).listen();
    new AppointmentBookedListener(natsWrapper.client).listen();
    new AppointmentUpdatedListener(natsWrapper.client).listen();
    new DatabaseBackupListener(natsWrapper.client).listen();
    new DatabaseUploadListener(natsWrapper.client).listen();
    new ConsultantCreatedListener(natsWrapper.client).listen();
    new AppointmentCancelListener(natsWrapper.client).listen();
    new AppointmentCompletedListener(natsWrapper.client).listen();
    new AppointmentReminderListener(natsWrapper.client).listen();
    new PaymentCompletedListener(natsWrapper.client).listen();
    new ConsultantInfoUpdatedListener(natsWrapper.client).listen();
    new PingListener(natsWrapper.client).listen();
    new FollowupReminderListener(natsWrapper.client).listen();
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


    let existingFixedPrice = await FixedPrice.findOne({});
    if (!existingFixedPrice) {
      existingFixedPrice = FixedPrice.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        shippingChargesInINR: 50,
        homeCollectionChargesInINR: 100,
        additionalHomeCollectionChargesInINR: 50,
        minimumOrderAmountForFreeDeliveryInINR: 1000,
        freeDeliveryOnMinimumAmountEnabled: true,
        minimumOrderAmountForFreeCollectionInINR: 800,
        freeCollectionOnMinimumAmountEnabled: true,
        discountOnMedicineInPercentage: 15,
        discountOnMedicineIsEnabled: true,
        discountOnDiagnosticTestInPercentage: 0,
        discountOnDiagnosticTestIsEnabled: false,
        lastUpdatedOn: new Date(),
        hospitalName: "Dr.A.Ramachandran’s Diabetes Hospitals",
        hospitalAddress: "No:110, Anna Salai",
        hospitalCity: "Guindy",
        hospitalState: 'Chennai',
        hospitalPincode: '600032',
        hospitalPhoneNumber: '044-22353729',
        hospitalEmail: `${String(process.env.SYSTEM_RECEIVER_EMAIL_ID)}`,
      });
      await existingFixedPrice.save();
    }
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!');
  });
};

start();
