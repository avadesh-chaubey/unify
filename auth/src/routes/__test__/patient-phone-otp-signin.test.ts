import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserType } from '@unifycaredigital/aem'

it('fails when a provided phone number that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/phoneotpsignin')
    .send({
      phoneNumber: '4444666666',
      otp: 5566
    })
    .expect(400);
});

it('fails when an incorrect otp is supplied', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post('/api/users/sendphoneemailotp')
    .send({
      phoneNumber: '6666666666',
      emailId: 'test@test.com',
    })
    .expect(200);

  await request(app)
    .post('/api/users/patientotpsignup')
    .send({
      id,
      userFirstName: 'Ashutosh',
      userLastName: 'Dhiman',
      emailId: 'test@test.com',
      phoneNumber: '6666666666',
      phoneOTP: 5555,
      emailOTP: 6666,
      entityId: 'RUF0008',
      userType: UserType.Patient
    })
    .expect(201);

  await request(app)
    .post('/api/users/sendphoneotp')
    .send({
      phoneNumber: '6666666666',
    })
    .expect(200);

  await request(app)
    .post('/api/users/phoneotpsignin')
    .send({
      phoneNumber: '6666666666',
      otp: 5566
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post('/api/users/sendphoneemailotp')
    .send({
      phoneNumber: '6666666666',
      emailId: 'test@test.com',
    })
    .expect(200);

  await request(app)
    .post('/api/users/patientotpsignup')
    .send({
      id,
      userFirstName: 'Ashutosh',
      userLastName: 'Dhiman',
      emailId: 'test@test.com',
      phoneNumber: '6666666666',
      phoneOTP: 5555,
      emailOTP: 6666,
      entityId: 'RUF0008',
      userType: UserType.Patient
    })
    .expect(201);

  await request(app)
    .post('/api/users/sendphoneotp')
    .send({
      phoneNumber: '6666666666',
    })
    .expect(200);

  const response = await request(app)
    .post('/api/users/phoneotpsignin')
    .send({
      phoneNumber: '6666666666',
      otp: 5555
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
