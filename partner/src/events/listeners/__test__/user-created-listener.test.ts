import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { AccessLevel, PartnerType, UserCreatedEvent, UserStatus, UserType } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { UserCreatedListener } from '../user-created-listener';
import { PartnerSuperuser } from '../../../models/partner-superuser';

const setup = async () => {
  // Create an instance of the listener
  const listener = new UserCreatedListener(natsWrapper.client);

  const id = new mongoose.Types.ObjectId().toHexString();

  // Create the fake data event
  const data: UserCreatedEvent['data'] = {
    id,
    userFirstName: 'Ashutosh',
    userLastName: 'Dhiman',
    emailId: 'ashutosh@test.com',
    phoneNumber: '6666666666',
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    userStatus: UserStatus.Verified,
    userType: UserType.PartnerSuperuser,
    accessLevel: AccessLevel.PartnerSuperuser,
    partnerType: PartnerType.MainBranch
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create new partner user', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  console.log(data);

  const newCandidate = await PartnerSuperuser.findById(data.id);
  console.log(newCandidate);

  expect(newCandidate!.userFirstName).toEqual(data.userFirstName);
  expect(newCandidate!.emailId).toEqual(data.emailId);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

