import request from 'supertest';
import { app } from '../../app';
import { PartnerBankDetails } from '../../models/partner-bank-details'
import { UserStatus, UserType, AccessLevel, DocumentStatus, KYCStatus, PartnerType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

it('has a route handler listening to /api/partner/bankdetails for post requests', async () => {
  const response = await request(app)
    .post('/api/partner/bankdetails')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/partner/bankdetails')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/partner/bankdetails')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid BankAccountName is provided', async () => {
  await request(app)
    .post('/api/partner/bankdetails')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      bankAccountName: '',
      bankAccountNumber: 'string',
      bankIFSCCode: 'string',
      bankName: 'string',
      bankChequeURL: 'string',
      bankChequeStatus: DocumentStatus.Unverified,
      partnerBankDetailsStatus: KYCStatus.Unverified,
    })
    .expect(400);

  await request(app)
    .post('/api/partner/bankdetails')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      bankAccountNumber: 'string',
      bankIFSCCode: 'string',
      bankName: 'string',
      bankChequeURL: 'string',
      bankChequeStatus: DocumentStatus.Unverified,
      partnerBankDetailsStatus: KYCStatus.Unverified,
    })
    .expect(400);
});

it('returns an error if an invalid bankAccountNumber is provided', async () => {
  await request(app)
    .post('/api/partner/bankdetails')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      bankAccountName: 'string',
      bankAccountNumber: '',
      bankIFSCCode: 'string',
      bankName: 'string',
      bankChequeURL: 'string',
      bankChequeStatus: DocumentStatus.Unverified,
      partnerBankDetailsStatus: KYCStatus.Unverified,
    })
    .expect(400);

  await request(app)
    .post('/api/partner/bankdetails')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      bankAccountName: 'string',
      bankIFSCCode: 'string',
      bankName: 'string',
      bankChequeURL: 'string',
      bankChequeStatus: DocumentStatus.Unverified,
      partnerBankDetailsStatus: KYCStatus.Unverified,
    })
    .expect(400);
});

it('returns an error if an invalid bankName is provided', async () => {
  await request(app)
    .post('/api/partner/bankdetails')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      bankAccountName: 'string',
      bankAccountNumber: 'string',
      bankIFSCCode: 'string',
      bankName: '',
      bankChequeURL: 'string',
      bankChequeStatus: DocumentStatus.Unverified,
      partnerBankDetailsStatus: KYCStatus.Unverified,
    })
    .expect(400);

  await request(app)
    .post('/api/partner/bankdetails')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      bankAccountName: 'string',
      bankAccountNumber: 'string',
      bankIFSCCode: 'string',
      bankChequeURL: 'string',
      bankChequeStatus: DocumentStatus.Unverified,
      partnerBankDetailsStatus: KYCStatus.Unverified,
    })
    .expect(400);

});

it('creates a bankdetails with valid inputs', async () => {
  let bankdetails = await PartnerBankDetails.find({});
  expect(bankdetails.length).toEqual(0);

  await request(app)
    .post('/api/partner/bankdetails')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
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

  bankdetails = await PartnerBankDetails.find({});
  expect(bankdetails.length).toEqual(1);
  expect(bankdetails[0].bankChequeStatus).toEqual(DocumentStatus.Unverified);
});
