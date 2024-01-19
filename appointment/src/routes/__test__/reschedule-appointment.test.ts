import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType, AccessLevel, SlotAvailability, ConsultationType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { AppointmentConfig } from '../../models/appointment-config';
import { Appointment } from '../../models/appointment';

it('has a route handler listening to /api/appointment/reschedule for post requests', async () => {
  const response = await request(app)
    .post('/api/appointment/reschedule')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/appointment/reschedule')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/appointment/reschedule')
    .set('Cookie', global.signin(UserType.CustomerSupport,
      AccessLevel.Employee,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid Date is provided', async () => {
  await request(app)
    .post('/api/appointment/reschedule')
    .set('Cookie', global.signin(UserType.CustomerSupport,
      AccessLevel.Employee,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: new mongoose.Types.ObjectId().toHexString(),
      customerId: new mongoose.Types.ObjectId().toHexString(),
      parentId: new mongoose.Types.ObjectId().toHexString(),
      appointmentId: new mongoose.Types.ObjectId().toHexString(),
      appointmentDate: '2022/09/12',
      appointmentSlotId: [6]
    })
    .expect(400);
});

it('returns an 201 if an valid Date is provided', async () => {

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
    .set('Cookie', global.signin(UserType.CustomerSupport,
      AccessLevel.Employee,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: consultantId,
      customerId: new mongoose.Types.ObjectId().toHexString(),
      parentId: new mongoose.Types.ObjectId().toHexString(),
      appointmentDate: '2022-09-22',
      appointmentSlotId: 4,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  await request(app)
    .post('/api/appointment/reschedule')
    .set('Cookie', global.signin(UserType.CustomerSupport,
      AccessLevel.Employee,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: consultantId,
      customerId: response.body.customerId,
      parentId: response.body.parentId,
      appointmentId: response.body.id,
      appointmentDate: '2022-09-22',
      appointmentSlotId: 6,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);



});



