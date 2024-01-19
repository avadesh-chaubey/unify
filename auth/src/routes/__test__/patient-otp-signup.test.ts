import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserType } from '@unifycaredigital/aem'

it('returns a 201 on successful signup', async () => {
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
      userFirstName: 'Ashutosh',
      userLastName: 'Dhiman',
      emailId: 'test@test.com',
      phoneNumber: '6666666666',
      phoneOTP: 5555,
      emailOTP: 6666,
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
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
      emailId: 'testtest.com',
      phoneNumber: '6666666666',
      phoneOTP: 5555,
      emailOTP: 6666,
      userType: UserType.Patient
    })
    .expect(400);
});

it('returns a 400 with an invalid OTP', async () => {
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
      phoneOTP: 5566,
      emailOTP: 6666,
      userType: UserType.Patient
    })
    .expect(400);
});

it('returns a 400 with missing email', async () => {
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
      phoneNumber: '6666666666',
      phoneOTP: 5566,
      emailOTP: 6666,
      userType: UserType.Patient
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {

  let id = new mongoose.Types.ObjectId().toHexString();
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
      userType: UserType.Patient
    })
    .expect(201);

  id = new mongoose.Types.ObjectId().toHexString();

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
      userType: UserType.Patient
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {

  let id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post('/api/users/sendphoneemailotp')
    .send({
      phoneNumber: '6666666666',
      emailId: 'test@test.com',
    })
    .expect(200);

  const response = await request(app)
    .post('/api/users/patientotpsignup')
    .send({
      id,
      userFirstName: 'Ashutosh',
      userLastName: 'Dhiman',
      emailId: 'test@test.com',
      phoneNumber: '6666666666',
      phoneOTP: 5555,
      emailOTP: 6666,
      userType: UserType.Patient
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
