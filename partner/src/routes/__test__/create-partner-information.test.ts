import request from 'supertest';
import { app } from '../../app';
import { PartnerInfo } from '../../models/partner-information'
import {
  UserStatus,
  UserType,
  AccessLevel,
  DocumentStatus,
  KYCStatus,
  PartnerType,
} from '@unifycaredigital/aem';
import mongoose from 'mongoose';

it('has a route handler listening to /api/partner/invites for post requests', async () => {
  const response = await request(app)
    .post('/api/partner/information')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/partner/information')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/partner/information')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid city is provided', async () => {
  await request(app)
    .post('/api/partner/information')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      legalName: 'string',
      website: 'string',
      services: 'string',
      addressLine1: 'string',
      addressLine2: 'string',
      city: '',
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
    .expect(400);

  await request(app)
    .post('/api/partner/information')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      legalName: 'string',
      website: 'string',
      services: 'string',
      addressLine1: 'string',
      addressLine2: 'string',
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
    .expect(400);
});

it('returns an error if an invalid State is provided', async () => {
  await request(app)
    .post('/api/partner/information')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      legalName: 'string',
      website: 'string',
      services: 'string',
      addressLine1: 'string',
      addressLine2: 'string',
      city: 'string',
      state: '',
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
    .expect(400);

  await request(app)
    .post('/api/partner/information')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      legalName: 'string',
      website: 'string',
      services: 'string',
      addressLine1: 'string',
      addressLine2: 'string',
      city: 'string',
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
    .expect(400);
});

it('returns an error if an invalid Country is provided', async () => {
  await request(app)
    .post('/api/partner/information')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
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
      country: '',
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
    .expect(400);

  await request(app)
    .post('/api/partner/information')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
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
    .expect(400);

});

it('creates a Info with valid inputs', async () => {
  let information = await PartnerInfo.find({});
  expect(information.length).toEqual(0);

  await request(app)
    .post('/api/partner/information')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
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

  information = await PartnerInfo.find({});
  expect(information.length).toEqual(1);
  expect(information[0].partnerInfoStatus).toEqual(KYCStatus.Unverified);
});
