import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType, AccessLevel, SlotAvailability, ConsultationType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { AppointmentConfig } from '../../models/appointment-config';
import { Appointment } from '../../models/appointment';

it('returns an 200 if an valid Time is provided', async () => {

  const appointmentDate = '2022-09-22';
  const availableSlots: number[] = [2, 4, 6, 26];

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
      appointmentSlotId: 26,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  await request(app)
    .post('/api/appointment/updateassistantappointment')
    .set('Cookie', global.signin(UserType.PhysicianAssistant,
      AccessLevel.Employee,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      appointmentId: response.body.id,
      appointmentDateAndTime: '22.09.2022 04:00',
    })
    .expect(200);



});



