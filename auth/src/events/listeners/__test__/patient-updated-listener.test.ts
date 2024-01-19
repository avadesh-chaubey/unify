import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {
  PatientUpdatedEvent,
  UserType,
  AccessLevel,
  UserStatus
} from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { PatientStatusChangedListener } from '../patient-updated-listener';
import { User } from '../../../models/user-auth';

const setup = async () => {

  const id = new mongoose.Types.ObjectId().toHexString();
  //create New User
  const user = User.build({
    userFirstName: 'Ashutosh',
    userLastName: 'Dhiman',
    id,
    emailId: 'email@email.com',
    phoneNumber: '9876598765',
    password: 'email@email.com',
    userType: UserType.Patient,
    partnerId: 'undefined',
    accessLevel: AccessLevel.Patient,
    lastAuthAt: new Date(),
    userStatus: UserStatus.Unverified,
    registrationTimeAndDate: new Date(),
    employeeId: 'NA',
    pin: 'NA'
  });
  await user.save();

  // Create an instance of the listener
  const listener = new PatientStatusChangedListener(natsWrapper.client);

  // Create the fake data event
  const data: PatientUpdatedEvent['data'] = {
    id: id,
    emailId: 'string',
    phoneNumber: 'string',
    partnerId: 'string',
    userStatus: UserStatus.Active,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create new Patient and change Status', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const newPatient = await User.findById(data.id);

  expect(newPatient!.userStatus).toEqual(UserStatus.Active);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
