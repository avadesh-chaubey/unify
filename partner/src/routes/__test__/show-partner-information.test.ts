import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import {
  UserType,
  AccessLevel,
  UserStatus,
  DocumentStatus,
  KYCStatus,
  PartnerType
} from '@unifycaredigital/aem';

it('returns a 404 if the partner information is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/partner/information/${id}`)
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send().expect(404);
});

it('returns the information if the information is found', async () => {

  const eid = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .post('/api/partner/information')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      eid))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      legalName: 'string',
      website: 'string',
      services: 'string',
      addressLine1: 'string',
      addressLine2: 'string',
      city: 'string',
      state: 'string',
      country: 'string',
      pincode: 'string',
      corporateId: 'string',
      corporateIdUrl: 'string',
      corporateIdStatus: DocumentStatus.Unverified,
      corporateTaxId: 'string',
      corporateTaxIdUrl: 'string',
      corporateTaxIdStatus: DocumentStatus.Unverified,
      goodsAndServicesTaxId: 'string',
      goodsAndServicesTaxIdUrl: 'string',
      goodsAndServicesTaxIdStatus: DocumentStatus.Unverified,
      partnerInfoStatus: KYCStatus.Unverified,
    })
    .expect(201);

  const informationResponse = await request(app)
    .get(`/api/partner/information`)
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      eid))
    .send()
    .expect(200);

  expect(informationResponse.body.city).toEqual('string');
  expect(informationResponse.body.state).toEqual('string');
});
