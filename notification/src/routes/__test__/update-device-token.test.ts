import request from 'supertest';
import { app } from '../../app';
import { DeviceList } from '../../models/device-list'
import { UserStatus, UserType, AccessLevel } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

it('update entry with valid inputs', async () => {
  let devices = await DeviceList.find({});
  expect(devices.length).toEqual(0);
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

  devices = await DeviceList.find({});
  expect(devices.length).toEqual(1);
  console.log(devices[0].devices);
  expect(devices[0].numberOfDevices).toEqual(1);

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

  devices = await DeviceList.find({});
  expect(devices.length).toEqual(1);
  console.log(devices[0].devices);
  expect(devices[0].numberOfDevices).toEqual(2);
});



