import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType, AccessLevel, SlotAvailability } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { AppointmentConfig } from '../../models/appointment-config';

it('has a route handler listening to /api/appointment/markleave for post requests', async () => {
  const response = await request(app)
    .post('/api/appointment/markleave')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/appointment/markleave')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/appointment/markleave')
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
    .post('/api/appointment/markleave')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: new mongoose.Types.ObjectId().toHexString(),
      leaveDate: '2020/11/28'
    })
    .expect(400);
});

it('returns an 200 if an valid Date is provided', async () => {

  const leaveDate = '2022-06-06';

  let slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(0);

  await request(app)
    .post('/api/appointment/markleave')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: new mongoose.Types.ObjectId().toHexString(),
      leaveDate: leaveDate
    })
    .expect(200);
});

it('check if all provided slots are marked unavailable after marking leave', async () => {

  const leaveDate = '2022-12-23';

  let slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(0);

  await request(app)
    .post('/api/appointment/markleave')
    .set('Cookie', global.signin(UserType.PartnerRosterManager,
      AccessLevel.PartnerManager,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: new mongoose.Types.ObjectId().toHexString(),
      leaveDate: leaveDate
    })
    .expect(200);

  slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(1);
  const array = [...slot[0].availableSlots];
  const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
  const SLICE_DURATION_IN_MIN = 30;
  const BASE_PRICE_IN_INR = 500

  const totalNumberOfSlots = (TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN);
  for (let i = 1; i < totalNumberOfSlots; i++) {
    expect(array[i]).toEqual(SlotAvailability.Unavailable);
  }
  });

