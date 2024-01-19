import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserType, AccessLevel, UserStatus, GenderType, PatientCreatedEvent } from '@unifycaredigital/aem';
import { PatientCreatedListener } from '../../events/listeners/patient-created-listener';
import { natsWrapper } from '../../nats-wrapper';


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

it('returns the patient along with all family members', async () => {

  const id = new mongoose.Types.ObjectId().toHexString();
  const firstName = 'Ashutosh';

  const { listener, data, msg } = await setup(id, firstName);

  await listener.onMessage(data, msg);

  const members = await request(app)
    .get(`/api/patient/familymembers`)
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      id,
      new mongoose.Types.ObjectId().toHexString()))
    .send()
    .expect(200);

  expect(members.body[0].userFirstName).toEqual('Ashutosh');
});
