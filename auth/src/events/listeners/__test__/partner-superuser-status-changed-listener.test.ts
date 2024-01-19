import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { PartnerSuperuserStatusChangedEvent, UserType, AccessLevel, UserStatus } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { PartnerSuperuserStatusChangedListener } from '../partner-superuser-status-changed-listener';
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
    userType: UserType.Doctor,
    partnerId: 'undefined',
    accessLevel: AccessLevel.PartnerSuperuser,
    lastAuthAt: new Date(),
    userStatus: UserStatus.Unverified,
    registrationTimeAndDate: new Date(),
    employeeId: 'NA',
    pin: 'NA'
  });
  await user.save();

  // Create an instance of the listener
  const listener = new PartnerSuperuserStatusChangedListener(natsWrapper.client);

  // Create the fake data event
  const data: PartnerSuperuserStatusChangedEvent['data'] = {
    id,
    userStatus: UserStatus.Active,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create new company and change status', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const newHospital = await User.findById(data.id);

  expect(newHospital!.userStatus).toEqual(UserStatus.Active);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
