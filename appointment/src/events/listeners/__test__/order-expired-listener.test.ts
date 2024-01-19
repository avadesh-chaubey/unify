import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import { Message } from 'node-nats-streaming';
import { AccessLevel, ConsultationType, OrderExpiredEvent, UserStatus, UserType, AppointmentPaymentStatus } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderExpiredListener } from '../order-expired-listener';
import { AppointmentConfig } from '../../../models/appointment-config';
import { Appointment } from '../../../models/appointment';

const setup = async () => {
  // Create an instance of the listener
  const appointmentDate = '2022-09-22';
  const availableSlots: number[] = [2, 4, 6];

  let slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(0);

  const consultantId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/appointment/addslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: consultantId,
      appointmentDate: appointmentDate,
      availableSlotList: availableSlots
    })
    .expect(201);


  const response = await request(app)
    .post('/api/appointment/add')
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: consultantId,
      customerId: new mongoose.Types.ObjectId().toHexString(),
      parentId: new mongoose.Types.ObjectId().toHexString(),
      appointmentDate: '2022-09-22',
      appointmentSlotId: 6,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);


  const listener = new OrderExpiredListener(natsWrapper.client);

  // Create the fake data event
  const data: OrderExpiredEvent['data'] = {
    patientId: response.body.customerId,
    productId: response.body.id
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create new Appointment and wait for expiry', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  console.log(data);

  const appointment = await Appointment.findById(data.productId);

  expect(appointment!.appointmentPaymentStatus).toEqual(AppointmentPaymentStatus.Expired);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

