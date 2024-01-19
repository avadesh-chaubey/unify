import request from 'supertest';
import { app } from '../../app';
import { PartnerSuperuser } from '../../models/partner-superuser'
import { natsWrapper } from '../../nats-wrapper';
import { PartnerStatus, PartnerType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { UserCreatedEvent, UserStatus, UserType, AccessLevel } from '@unifycaredigital/aem';
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

it('has a route handler listening to /api/partner/superuser for post requests', async () => {
  const response = await request(app)
    .put('/api/partner/sudo/superuser')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .put('/api/partner/sudo/superuser')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .put('/api/partner/sudo/superuser')
    .set('Cookie', global.signin(UserType.Superadmin,
      AccessLevel.SuperAdmin,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid Partner Id is provided', async () => {
  await request(app)
    .put('/api/partner/sudo/superuser')
    .set('Cookie', global.signin(UserType.Superadmin,
      AccessLevel.SuperAdmin,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      userStatus: UserStatus.Unverified,
    })
    .expect(400);
});


it('update partner status with valid inputs', async () => {

  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const newPartner = await PartnerSuperuser.findById(data.id);
  expect(newPartner!.userStatus).toEqual(UserStatus.Verified);

  await request(app)
    .put('/api/partner/sudo/superuser')
    .set('Cookie', global.signin(UserType.Superadmin,
      AccessLevel.SuperAdmin,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      id: newPartner!.id,
      userStatus: UserStatus.Active,
    })
    .expect(200);

  const updatedPartner = await PartnerSuperuser.findById(newPartner!.id,);
  expect(updatedPartner!.userStatus).toEqual(UserStatus.Active);
});


it('publishes an event', async () => {

  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const newPartner = await PartnerSuperuser.findById(data.id);
  expect(newPartner!.userStatus).toEqual(UserStatus.Verified);

  await request(app)
    .put('/api/partner/sudo/superuser')
    .set('Cookie', global.signin(UserType.Superadmin,
      AccessLevel.SuperAdmin,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      id: newPartner!.id,
      userStatus: UserStatus.Active,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

