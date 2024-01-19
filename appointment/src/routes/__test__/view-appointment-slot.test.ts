import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType, AccessLevel, SlotAvailability } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { AppointmentConfig } from '../../models/appointment-config';

it('has a route handler listening to /api/appointment/viewslots for post requests', async () => {
  const response = await request(app)
    .post('/api/appointment/viewslots')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/appointment/viewslots')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/appointment/viewslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid startDate is provided', async () => {
  const appointmentDate = '2022-09-13';
  const availableSlots: number[] = [2, 4, 6];

  let slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(0);
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/appointment/addslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: id,
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

  await request(app)
    .post('/api/appointment/viewslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: new mongoose.Types.ObjectId().toHexString(),
      startDate: '2020/09/13',
      stopDate: '2020-09-13',
    })
    .expect(400);
});

it('returns an error if an invalid stopDate is provided', async () => {
  const appointmentDate = '2022-09-13';
  const availableSlots: number[] = [2, 4, 6];

  let slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(0);
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/appointment/addslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: id,
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

  await request(app)
    .post('/api/appointment/viewslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: new mongoose.Types.ObjectId().toHexString(),
      startDate: '2022-09-13',
      stopDate: '2022/09/13',
    })
    .expect(400);
});

it('returns an error if an stopDate before to startDate is provided', async () => {
  const appointmentDate = '2022-09-13';
  const availableSlots: number[] = [2, 4, 6];

  let slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(0);
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/appointment/addslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: id,
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

  await request(app)
    .post('/api/appointment/viewslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: new mongoose.Types.ObjectId().toHexString(),
      startDate: '2022-09-13',
      stopDate: '2022-09-12',
    })
    .expect(400);
});

it('returns an 200 if an valid Date is provided', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  let appointmentDate = '2022-09-13';
  let availableSlots: number[] = [2, 4, 6];

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
      consultantId: id,
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

  appointmentDate = '2022-09-14';
  const availableSlots2: number[] = [3, 5, 7];

  slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(1);

  await request(app)
    .post('/api/appointment/addslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: id,
      appointmentDate: appointmentDate,
      availableSlotList: availableSlots2
    })
    .expect(201);

  slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(2);

  const array2 = [...slot[1].availableSlots];
  expect(array2[3]).toEqual(SlotAvailability.Available);
  expect(array2[5]).toEqual(SlotAvailability.Available);
  expect(array2[7]).toEqual(SlotAvailability.Available);

  const response = await request(app)
    .post('/api/appointment/viewslots')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: id,
      startDate: '2022-09-13',
      stopDate: '2022-09-14',
    })
    .expect(200);
});
