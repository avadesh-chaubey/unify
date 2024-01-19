import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType, AccessLevel, SlotAvailability } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { AppointmentConfig } from '../../models/appointment-config';

it('has a route handler listening to /api/appointment/markleave for post requests', async () => {
  const response = await request(app)
    .post('/api/appointment/cancelleave')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/appointment/cancelleave')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/appointment/cancelleave')
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
    .post('/api/appointment/cancelleave')
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


