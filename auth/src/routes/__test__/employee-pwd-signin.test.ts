import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType } from '@unifycaredigital/aem';
import { User } from '../../models/user-auth';
import jwt from 'jsonwebtoken';

it('fails when a email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/employeesignin')
    .send({
      emailId: 'test@test.com',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {

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

  const user = await User.find({});
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

  await request(app)
    .post('/api/users/employeesignin')
    .send({
      emailId: 'test@test.com',
      password: 'password123',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {

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

  const user = await User.find({});
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

  const response = await request(app)
    .post('/api/users/employeesignin')
    .send({
      emailId: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
