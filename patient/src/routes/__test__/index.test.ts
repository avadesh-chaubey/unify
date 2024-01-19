import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { AccessLevel, GenderType, PatientCreatedEvent, UserStatus, UserType } from '@unifycaredigital/aem';
import { natsWrapper } from '../../nats-wrapper';
import { PatientCreatedListener } from '../../events/listeners/patient-created-listener';

const setup = async (id: string, firstName: string) => {

  // Create an instance of the listener
  const listener = new PatientCreatedListener(natsWrapper.client);

  // Create the fake data event
  const data: PatientCreatedEvent['data'] = {
    id,
    userFirstName: 'Ashutosh',
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


it('can fetch self info', async () => {

  const id = new mongoose.Types.ObjectId().toHexString();
  const firstName = 'Ashutosh';

  const { listener, data, msg } = await setup(id, firstName);

  await listener.onMessage(data, msg);


  const response = await request(app).get('/api/patient')
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      id,
      new mongoose.Types.ObjectId().toHexString()))
    .send().expect(200);

  console.log(response.body);

  expect(response.body.userFirstName).toEqual('Ashutosh');
});
