import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { UserCreatedEvent, UserStatus, UserType, AccessLevel, PartnerType } from '@unifycaredigital/aem';
import { natsWrapper } from '../../nats-wrapper';
import { UserCreatedListener } from '../../events/listeners/user-created-listener';

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

it('returns a 404 if the partner is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/partner/sudu/superuser/${id}`)
    .set('Cookie', global.signin(UserType.Superadmin,
      AccessLevel.SuperAdmin,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send().expect(404);
});

it('returns the partner if the partner is found', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  console.log(data.id);
  const partnerResponse = await request(app)
    .get(`/api/partner/sudo/superuser/${data.id}`)
    .set('Cookie', global.signin(UserType.Superadmin,
      AccessLevel.SuperAdmin,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send()
    .expect(200);

  expect(partnerResponse.body.userFirstName).toEqual('Ashutosh');
  expect(partnerResponse.body.emailId).toEqual('ashutosh@test.com');
});
