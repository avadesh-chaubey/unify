import request from 'supertest';
import { app } from '../../app';
import { PartnerInfo } from '../../models/partner-information'
import { DocumentStatus, KYCStatus } from '@unifycaredigital/aem';
import { UserStatus, UserType, AccessLevel, PartnerType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

it('has a route handler listening to /api/partner/information for post requests', async () => {
  const response = await request(app)
    .put('/api/partner/information')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .put('/api/partner/information')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .put('/api/partner/information')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('update partner status with valid inputs', async () => {

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

  await request(app)
    .put('/api/partner/information')
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
      partnerInfoStatus: KYCStatus.Verified,
    })
    .expect(200);

  const updatedPartnerSubuser = await PartnerInfo.findById(eid);
  expect(updatedPartnerSubuser!.partnerInfoStatus).toEqual(DocumentStatus.Unverified);
});
