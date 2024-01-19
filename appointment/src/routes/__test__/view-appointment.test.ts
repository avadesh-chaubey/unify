import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserType, AccessLevel, UserStatus, ConsultationType } from '@unifycaredigital/aem';

it('returns a 200 even if the appointment is not found', async () => {
  const customerId = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/appointment/view/${customerId}`)
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send().expect(200);
});

it('returns the appointment if the appointment is found', async () => {
  const appointmentDate = '2022-09-22';
  const availableSlots: number[] = [2, 4, 6];

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

  const customerId = new mongoose.Types.ObjectId().toHexString();


  const response = await request(app)
    .post('/api/appointment/add')
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      consultantId: consultantId,
      customerId: customerId,
      parentId: new mongoose.Types.ObjectId().toHexString(),
      appointmentDate: '2022-09-22',
      appointmentSlotId: 6,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);


  const appointment = await request(app)
    .get(`/api/appointment/view/${response.body.customerId}`)
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send()
    .expect(200);

  console.log(appointment.body);
  expect(appointment.body[0].appointmentDate).toEqual('2022-09-22');
  expect(appointment.body[0].consultationType).toEqual(ConsultationType.Diabetologist);
});
