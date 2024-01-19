import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType, AccessLevel, SlotAvailability } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { AppointmentConfig } from '../../models/appointment-config';

it('has a route handler listening to /api/appointment/addslots for post requests', async () => {
  const response = await request(app)
    .post('/api/appointment/addslots')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/appointment/addslots')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/appointment/addslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid Date is provided', async () => {
  await request(app)
    .post('/api/appointment/addslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: new mongoose.Types.ObjectId().toHexString(),
      appointmentDate: '2020/09/12',
      availableSlots: [2, 6, 8]
    })
    .expect(400);
});

it('returns an 201 if an valid Date is provided', async () => {

  const appointmentDate = '2022-09-22';
  const availableSlots: number[] = [2, 4, 6];

  let slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(0);

  await request(app)
    .post('/api/appointment/addslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: new mongoose.Types.ObjectId().toHexString(),
      appointmentDate: appointmentDate,
      availableSlotList: availableSlots
    })
    .expect(201);

  slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(1);
  expect(slot[0].appointmentDate).toEqual(appointmentDate);
});

it('check if all provided slots are marked available', async () => {

  const appointmentDate = '2022-09-13';
  const availableSlots: number[] = [2, 4, 6];

  let slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(0);

  await request(app)
    .post('/api/appointment/addslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: new mongoose.Types.ObjectId().toHexString(),
      appointmentDate: appointmentDate,
      availableSlotList: availableSlots
    })
    .expect(201);

  slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(1);
  const array = [...slot[0].availableSlots];
  expect(array[2]).toEqual(SlotAvailability.Available);
  expect(array[4]).toEqual(SlotAvailability.Available);
  expect(array[6]).toEqual(SlotAvailability.Available);
});

