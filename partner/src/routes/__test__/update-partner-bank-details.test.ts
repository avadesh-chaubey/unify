import request from 'supertest';
import { app } from '../../app';
import { PartnerBankDetails } from '../../models/partner-bank-details'
import { DocumentStatus, KYCStatus } from '@unifycaredigital/aem';
import { UserStatus, UserType, AccessLevel, PartnerType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

it('has a route handler listening to /api/partner/bankdetails for post requests', async () => {
  const response = await request(app)
    .put('/api/partner/bankdetails')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .put('/api/partner/bankdetails')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .put('/api/partner/bankdetails')
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
    .post('/api/partner/bankdetails')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      eid))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      bankAccountName: 'string',
      bankAccountNumber: 'string',
      bankIFSCCode: 'string',
      bankName: 'string',
      bankChequeURL: 'string',
      bankChequeStatus: DocumentStatus.Unverified,
      partnerBankDetailsStatus: KYCStatus.Unverified,
    })
    .expect(201);

  await request(app)
    .put('/api/partner/bankdetails')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      eid))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      bankAccountName: 'string',
      bankAccountNumber: 'string',
      bankIFSCCode: 'string',
      bankName: 'string',
      bankChequeURL: 'string',
      bankChequeStatus: DocumentStatus.Verified,
      partnerBankDetailsStatus: KYCStatus.Unverified,
    })
    .expect(200);

  const updatedPartnerSubuser = await PartnerBankDetails.findById(response.body.id,);
  expect(updatedPartnerSubuser!.bankChequeStatus).toEqual(DocumentStatus.Unverified);
});
