import { UserType } from '@unifycaredigital/aem';
import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {

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
});

it('returns a 400 with an invalid email', async () => {

  await request(app)
    .post('/api/users/partnersignup')
    .send({
      userFirstName: 'Ashutosh',
      userLastName: 'Dhiman',
      emailId: 'testtest.com',
      phoneNumber: '6666666666',
      password: 'password',
      userType: UserType.PartnerSuperuser,
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {

  await request(app)
    .post('/api/users/partnersignup')
    .send({
      userFirstName: 'Ashutosh',
      userLastName: 'Dhiman',
      emailId: 'test@test.com',
      phoneNumber: '6666666666',
      password: '123',
      userType: UserType.PartnerSuperuser,
    })
    .expect(400);
});

it('returns a 400 with missing email', async () => {

  await request(app)
    .post('/api/users/partnersignup')
    .send({
      userFirstName: 'Ashutosh',
      userLastName: 'Dhiman',
      phoneNumber: '6666666666',
      password: '123',
      userType: UserType.PartnerSuperuser,
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {


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
    .expect(400);
});

it('sets a cookie after successful signup', async () => {

  const response = await request(app)
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

  expect(response.get('Set-Cookie')).toBeDefined();
});
