import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserType } from '@unifycaredigital/aem';

it('clears the cookie after signing out', async () => {
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

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
