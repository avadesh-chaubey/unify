import request from 'supertest';
import { app } from '../../app';
import { DeviceList } from '../../models/device-list'
import { UserStatus, UserType, AccessLevel } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

it('remove entry with valid inputs', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/notification/token/update')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      id,
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      uuid: 'ABSC-AAD-DDDD-YYYY',
      token: 'New User',
      deviceType: 'ios',
    })
    .expect(200);

  await request(app)
    .post('/api/notification/token/update')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      id,
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      uuid: 'ABBBB-AAD-DDDD-YYYY',
      token: 'OLD User',
      deviceType: 'ios',
    })
    .expect(200);

  await request(app)
    .post('/api/notification/token/remove')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      id,
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      uuid: 'ABBBB-AAD-DDDD-YYYY',
    })
    .expect(200);

  const devices = await DeviceList.find({});
  expect(devices.length).toEqual(1);
  console.log(devices[0].devices);
  expect(devices[0].numberOfDevices).toEqual(1);

});



