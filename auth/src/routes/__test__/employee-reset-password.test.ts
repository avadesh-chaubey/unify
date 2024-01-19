import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType } from '@unifycaredigital/aem';
import { User } from '../../models/user-auth';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

it('fails when no password is provided', async () => {
  const cookie = await global.signin();

  await request(app).post(`/api/users/resetpassword`)
    .set('Cookie', cookie)
    .send({
      newpassword: 'key12345'
    })
    .expect(400);
});

it('fails when empty password is provided', async () => {

  const cookie = await global.signin();

  await request(app).post(`/api/users/resetpassword`)
    .set('Cookie', cookie)
    .send({
      oldpassword: '',
      newpassword: 'key12344'
    })
    .expect(400);
});

it('fails when invalid password is provided', async () => {

  const cookie = await global.signin();

  await request(app).post(`/api/users/resetpassword`)
    .set('Cookie', cookie)
    .send({
      oldpassword: 'key123456',
      newpassword: 'key12344'
    })
    .expect(400);
});
