import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import { Message } from 'node-nats-streaming';
import { AccessLevel, ConsultationType, PaymentCompletedEvent, UserStatus, UserType, AppointmentStatus } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { PaymentCompletedListener } from '../payment-completed-listener';
import { AppointmentConfig } from '../../../models/appointment-config';
import { Appointment } from '../../../models/appointment';
import { PhysicianAssistantRoster, Roster } from '../../../models/physician-assistant-roster';
import moment from 'moment';

let appointmentId = '';

const setup = async () => {

  const idA = new mongoose.Types.ObjectId().toHexString();
  const rosterA = {
    physicianAssistantId: idA,
    dateInYYYYMMDD: moment().utcOffset(330).format('YYYY-MM-DD'),
    shiftFirstSlotId: 1,
    shiftLastSlotId: 80,
    numberOfAppointments: 0,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }
  const idB = new mongoose.Types.ObjectId().toHexString();
  const rosterB = {
    physicianAssistantId: idB,
    dateInYYYYMMDD: moment().utcOffset(330).format('YYYY-MM-DD'),
    shiftFirstSlotId: 1,
    shiftLastSlotId: 80,
    numberOfAppointments: 0,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }
  const idC = new mongoose.Types.ObjectId().toHexString();
  const rosterC = {
    physicianAssistantId: idC,
    dateInYYYYMMDD: moment().utcOffset(330).format('YYYY-MM-DD'),
    shiftFirstSlotId: 1,
    shiftLastSlotId: 80,
    numberOfAppointments: 0,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }
  const rosterD = {
    physicianAssistantId: idA,
    dateInYYYYMMDD: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
    shiftFirstSlotId: 1,
    shiftLastSlotId: 80,
    numberOfAppointments: 0,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }
  const rosterE = {
    physicianAssistantId: idB,
    dateInYYYYMMDD: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
    shiftFirstSlotId: 1,
    shiftLastSlotId: 80,
    numberOfAppointments: 0,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }
  const rosterF = {
    physicianAssistantId: idC,
    dateInYYYYMMDD: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
    shiftFirstSlotId: 1,
    shiftLastSlotId: 80,
    numberOfAppointments: 0,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }

  const rosterList: Roster[][] = [[rosterA, rosterB, rosterC], [rosterD, rosterE, rosterF],]

  const physicianAssistantRoster = PhysicianAssistantRoster.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    availableAssistantList: rosterList
  });
  await physicianAssistantRoster.save();

  const listener = new PaymentCompletedListener(natsWrapper.client);


  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg };

};

it('create new Appointment and wait for confirmation', async (done) => {

  // Create an instance of the listener
  const appointmentDate = moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD');
  const availableSlots: number[] = [1];

  for (let i = 0; i < 70; i++) {
    availableSlots.push(i);
  }

  let slot = await AppointmentConfig.find({});
  expect(slot.length).toEqual(0);

  const consultantId = new mongoose.Types.ObjectId().toHexString();

  let { listener, msg } = await setup();

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


  let response = await request(app)
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
      appointmentDate: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
      appointmentSlotId: 1,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  // Create the fake data event
  let data = {
    productId: response.body.id,
    payment_id: 'string',
    version: 3,
    arhOrderId: 2,
    paymentMode: 'credit card'
  };

  await listener.onMessage(data, msg);


  response = await request(app)
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
      appointmentDate: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
      appointmentSlotId: 2,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  // Create the fake data event
  data = {
    productId: response.body.id,
    payment_id: 'string',
    version: 3,
    arhOrderId: 2,
    paymentMode: 'credit card'
  };

  await listener.onMessage(data, msg);

  response = await request(app)
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
      appointmentDate: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
      appointmentSlotId: 3,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  // Create the fake data event
  data = {
    productId: response.body.id,
    payment_id: 'string',
    version: 3,
    arhOrderId: 2,
    paymentMode: 'credit card'
  };

  await listener.onMessage(data, msg);

  response = await request(app)
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
      appointmentDate: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
      appointmentSlotId: 4,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  // Create the fake data event
  data = {
    productId: response.body.id,
    payment_id: 'string',
    version: 3,
    arhOrderId: 2,
    paymentMode: 'credit card'
  };

  await listener.onMessage(data, msg);

  response = await request(app)
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
      appointmentDate: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
      appointmentSlotId: 5,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  // Create the fake data event
  data = {
    productId: response.body.id,
    payment_id: 'string',
    version: 3,
    arhOrderId: 2,
    paymentMode: 'credit card'
  };

  await listener.onMessage(data, msg);

  response = await request(app)
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
      appointmentDate: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
      appointmentSlotId: 6,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  // Create the fake data event
  data = {
    productId: response.body.id,
    payment_id: 'string',
    version: 3,
    arhOrderId: 2,
    paymentMode: 'credit card'
  };

  await listener.onMessage(data, msg);

  response = await request(app)
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
      appointmentDate: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
      appointmentSlotId: 7,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  // Create the fake data event
  data = {
    productId: response.body.id,
    payment_id: 'string',
    version: 3,
    arhOrderId: 2,
    paymentMode: 'credit card'
  };

  await listener.onMessage(data, msg);

  response = await request(app)
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
      appointmentDate: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
      appointmentSlotId: 8,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  // Create the fake data event
  data = {
    productId: response.body.id,
    payment_id: 'string',
    version: 3,
    arhOrderId: 2,
    paymentMode: 'credit card'
  };

  await listener.onMessage(data, msg);

  response = await request(app)
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
      appointmentDate: moment().utcOffset(330).add(1, 'days').format('YYYY-MM-DD'),
      appointmentSlotId: 9,
      consultationType: ConsultationType.Diabetologist
    })
    .expect(201);

  // Create the fake data event
  data = {
    productId: response.body.id,
    payment_id: 'string',
    version: 3,
    arhOrderId: 2,
    paymentMode: 'credit card'
  };

  await listener.onMessage(data, msg);

  done();

});

