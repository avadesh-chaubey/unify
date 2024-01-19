import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType } from '@unifycaredigital/aem';
import { User } from '../../models/user-auth';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

it('fails when provided token does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  //create token for email verification
  const verificationKey = jwt.sign(
    {
      id: id,
    },
    process.env.JWT_KEY!, { expiresIn: 60 * 60 }
  );

  await request(app).get(`/api/users/emailverification/${verificationKey}`)
    .send()
    .expect(400);
});

it('responds with 400 when given Invalid credentials', async () => {

  let user = await User.find({});
  expect(user.length).toEqual(0);

  await request(app)
    .post('/api/users/partnersignup')
    .send({
      userFirstName: 'Ashutosh',
      userLastName: 'Dhiman',
      emailId: 'test@test.com',
      phoneNumber: '6666666666',
      password: 'password',
      userType: UserType.PartnerSuperuser,
    })
    .expect(201);

  user = await User.find({});
  expect(user.length).toEqual(1);
  expect(user[0].userStatus).toEqual(UserStatus.Unverified);

  //create token for email verification
  const verificationKey = jwt.sign(
    {
      id: user[0].id,
    },
    process.env.JWT_KEY!, { expiresIn: 60 * 60 }
  );

  await request(app).get(`/api/users/emailverification/${verificationKey}`)
    .send()
    .expect(200);

  user = await User.find({});
  expect(user.length).toEqual(1);
  expect(user[0].userStatus).toEqual(UserStatus.Verified);
});
