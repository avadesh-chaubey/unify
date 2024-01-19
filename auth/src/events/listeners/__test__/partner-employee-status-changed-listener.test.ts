import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { PartnerEmployeeStatusChangedEvent, UserType, AccessLevel, UserStatus } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { PartnerEmployeeStatusChangedListener } from '../partner-employee-status-changed-listener';
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
    partnerId: 'RUF0008',
    accessLevel: AccessLevel.Employee,
    lastAuthAt: new Date(),
    userStatus: UserStatus.Active,
    registrationTimeAndDate: new Date(),
    employeeId: 'NA',
    pin: 'NA'
  });
  await user.save();

  // Create an instance of the listener
  const listener = new PartnerEmployeeStatusChangedListener(natsWrapper.client);

  // Create the fake data event
  const data: PartnerEmployeeStatusChangedEvent['data'] = {
    id,
    userStatus: UserStatus.Suspended,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('Update Hospital Subuser Status', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const newHospital = await User.findById(data.id);

  expect(newHospital!.partnerId).toEqual('RUF0008');
  expect(newHospital!.userStatus).toEqual(UserStatus.Suspended);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
