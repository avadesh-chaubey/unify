import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { AccessLevel, PartnerType, UserCreatedEvent, UserStatus, UserType } from '@unifycaredigital/aem';
import { natsWrapper } from '../../nats-wrapper';
import { UserCreatedListener } from '../../events/listeners/user-created-listener';

const setup = async (fid: string) => {
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
    partnerId: fid,
    userStatus: UserStatus.Unverified,
    userType: UserType.PartnerSuperuser,
    accessLevel: AccessLevel.PartnerSuperuser,
    partnerType: PartnerType.MainBranch,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};


it('can fetch state of partner', async () => {

  const eid = new mongoose.Types.ObjectId().toHexString();

  const { listener, data, msg } = await setup(eid);

  await listener.onMessage(data, msg);

  const response = await request(app).get('/api/partner')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      eid))
    .send().expect(200);

  console.log(response.body);

  expect(response.body.id).toEqual(eid);
});
