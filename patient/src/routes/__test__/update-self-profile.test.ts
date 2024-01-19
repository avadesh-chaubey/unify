import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType, AccessLevel, GenderType, PatientCreatedEvent } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { PatientCreatedListener } from '../../events/listeners/patient-created-listener';

const setup = async (id: string, firstName: string) => {

  // Create an instance of the listener
  const listener = new PatientCreatedListener(natsWrapper.client);

  // Create the fake data event
  const data: PatientCreatedEvent['data'] = {
    id,
    userFirstName: firstName,
    userLastName: 'Dhiman',
    emailId: 'email@email.com',
    phoneNumber: '9876598765',
    partnerId: 'RUF00045',
    dateOfBirth: 'data.dateOfBirth',
    gender: GenderType.Male,
    languages: ["Hindi"],
      address:"address",
      city:"Delhi",
      state:"Delhi",
      pin:"110060"
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};


it('has a route handler listening to /api/patient/profileImage for post requests', async () => {
  const response = await request(app)
    .post('/api/patient/profileImage')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/patient/profileImage')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/patient/profileImage')
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('update partner status with valid inputs', async () => {

  const id = new mongoose.Types.ObjectId().toHexString();
  const firstName = 'Ashutosh';

  const { listener, data, msg } = await setup(id, firstName);

  await listener.onMessage(data, msg);


  const response = await request(app)
    .post('/api/patient/profileImage')
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      id,
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      profileImageName: 'profileImageName'
    })
    .expect(200);

  expect(response.body.profileImageName).toEqual('profileImageName');
});
