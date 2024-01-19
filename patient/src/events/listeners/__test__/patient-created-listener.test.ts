import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { GenderType, PatientCreatedEvent, RelationshipType } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { PatientCreatedListener } from '../patient-created-listener';
import { Patient } from '../../../models/patient';

const setup = async () => {

  // Create an instance of the listener
  const listener = new PatientCreatedListener(natsWrapper.client);
  const id = new mongoose.Types.ObjectId().toHexString();

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
    address: "address",
    city: "Delhi",
    state: "Delhi",
    pin: "110060"
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create new Patient', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const newHospital = await Patient.findById(data.id);

  expect(newHospital!.partnerId).toEqual('RUF00045');
  expect(newHospital!.relationship).toEqual(RelationshipType.Self);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
