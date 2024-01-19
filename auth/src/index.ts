import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OTPExpiredListener } from './events/listeners/otp-expired-listener';
import { PartnerEmployeeCreatedListener } from './events/listeners/partner-employee-created-listener';
import { PartnerSuperuserStatusChangedListener } from './events/listeners/partner-superuser-status-changed-listener';
import { PatientStatusChangedListener } from './events/listeners/patient-updated-listener';
import { PartnerEmployeeStatusChangedListener } from './events/listeners/partner-employee-status-changed-listener';
import { DatabaseBackupListener } from './events/listeners/database-backup-listener';
import { DatabaseUploadListener } from './events/listeners/database-upload-listener';
import { User } from './models/user-auth'
import { AccessLevel, PartnerType, UserStatus, UserType } from '@unifycaredigital/aem';
import { UserCreatedPublisher } from './events/publishers/user-created-publisher';
import { PingListener } from './events/listeners/ping-listener';
import { Liveness } from './models/liveness';
import { firebase } from './firebase';

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
  if (!process.env.MASTER_ROSTER_EMAIL_ID) {
    throw new Error('MASTER_ROSTER_EMAIL_ID must be defined');
  }
  if (!process.env.MASTER_ROSTER_MOBILE_NUMBER) {
    throw new Error('MASTER_ROSTER_MOBILE_NUMBER must be defined');
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

    new OTPExpiredListener(natsWrapper.client).listen();
    new PartnerEmployeeCreatedListener(natsWrapper.client).listen();
    new PartnerSuperuserStatusChangedListener(natsWrapper.client).listen();
    new PatientStatusChangedListener(natsWrapper.client).listen();
    new PartnerEmployeeStatusChangedListener(natsWrapper.client).listen();
    new DatabaseBackupListener(natsWrapper.client).listen();
    new DatabaseUploadListener(natsWrapper.client).listen();
    new PingListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to MongoDb');

    let liveness = await Liveness.findOne({});
    console.log('liveness: ', liveness);

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

  //Create Roster Manager
  const partnerId = new mongoose.Types.ObjectId().toHexString();

  let rosterManager = await User.findOne({ emailId: process.env.MASTER_ROSTER_EMAIL_ID, phoneNumber: process.env.MASTER_ROSTER_MOBILE_NUMBER })
  if (!rosterManager) {
    const password = 'diahome2021';
    rosterManager = User.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userFirstName: 'ARH',
      userLastName: 'Digital',
      emailId: String(process.env.MASTER_ROSTER_EMAIL_ID),
      phoneNumber: String(process.env.MASTER_ROSTER_MOBILE_NUMBER),
      password: password,
      userType: UserType.PartnerRosterManager,
      partnerId: new mongoose.Types.ObjectId().toHexString(),
      accessLevel: AccessLevel.PartnerSuperuser,
      lastAuthAt: new Date(),
      userStatus: UserStatus.Verified,
      registrationTimeAndDate: new Date(),
      pin: 'NA',
      employeeId: ''
    });
    await rosterManager.save();
  }

  //////// Publish New User Create Event
  new UserCreatedPublisher(natsWrapper.client).publish({
    id: rosterManager.id!,
    userFirstName: rosterManager.userFirstName,
    userLastName: rosterManager.userLastName,
    emailId: rosterManager.emailId,
    phoneNumber: rosterManager.phoneNumber,
    userType: rosterManager.userType,
    partnerId: rosterManager.partnerId,
    userStatus: rosterManager.userStatus,
    accessLevel: rosterManager.accessLevel,
    partnerType: PartnerType.MainBranch
  });

  //Create Default Assistant
  let assistant = await User.findOne({ emailId: process.env.DEFAULT_ASSISTANT_EMAIL_ID, phoneNumber: process.env.DEFAULT_ASSISTANT_MOBILE_NUMBER })
  if (!assistant) {
    const password = 'diahome2021';
    assistant = User.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userFirstName: 'Diahome',
      userLastName: 'Assistant',
      emailId: String(process.env.DEFAULT_ASSISTANT_EMAIL_ID),
      phoneNumber: String(process.env.DEFAULT_ASSISTANT_MOBILE_NUMBER),
      password: password,
      userType: UserType.PhysicianAssistant,
      partnerId: partnerId,
      accessLevel: AccessLevel.Employee,
      lastAuthAt: new Date(),
      userStatus: UserStatus.Verified,
      registrationTimeAndDate: new Date(),
      pin: 'NA',
      employeeId: ''
    });
    await assistant.save();

    /////////////////////////////////
    await firebase
      .auth()
      .createUser({
        uid: assistant.id,
        email: assistant.emailId,
        phoneNumber: "+91" + assistant.phoneNumber,
        emailVerified: true,
        password: assistant.emailId,
        displayName: assistant.userFirstName + " " + assistant.userLastName,
        disabled: false,
      })
      .then((userRecord: any) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
      })
      .catch((error: any) => {
        console.log('Error creating new user:', error);
      });


    //////// Publish New User Create Event
    new UserCreatedPublisher(natsWrapper.client).publish({
      id: assistant.id!,
      userFirstName: assistant.userFirstName,
      userLastName: assistant.userLastName,
      emailId: assistant.emailId,
      phoneNumber: assistant.phoneNumber,
      userType: assistant.userType,
      partnerId: assistant.partnerId,
      userStatus: assistant.userStatus,
      accessLevel: assistant.accessLevel,
      partnerType: PartnerType.MainBranch
    });
  }


  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!');
  });
};

start();
