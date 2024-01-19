import request from 'supertest';
import { app } from '../../app';
import { PartnerSigningAuth } from '../../models/partner-signing-auth'
import { natsWrapper } from '../../nats-wrapper';
import { UserStatus, UserType, AccessLevel, KYCStatus, DocumentStatus, PartnerType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

it('has a route handler listening to /api/partner/signingauth for post requests', async () => {
  const response = await request(app)
    .post('/api/partner/signingauth')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/partner/signingauth')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/partner/signingauth')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid signingAuthName is provided', async () => {
  await request(app)
    .post('/api/partner/signingauth')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      partnerSigningAuthStatus: KYCStatus.Unverified,
      signingAuthName: '',
      signingAuthWorkEmail: 'string@string.com',
      signingAuthTaxId: 'string',
      signingAuthTaxIdUrl: 'string',
      signingAuthTaxIdStatus: DocumentStatus.Unverified,
      signingAuthTitle: 'string',
      signingAuthLetterUrl: 'string',
      signingAuthLetterStatus: DocumentStatus.Unverified,
    })
    .expect(400);

  await request(app)
    .post('/api/partner/signingauth')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      partnerSigningAuthStatus: KYCStatus.Unverified,
      signingAuthWorkEmail: 'string@string.com',
      signingAuthTaxId: 'string',
      signingAuthTaxIdUrl: 'string',
      signingAuthTaxIdStatus: DocumentStatus.Unverified,
      signingAuthTitle: 'string',
      signingAuthLetterUrl: 'string',
      signingAuthLetterStatus: DocumentStatus.Unverified,
    })
    .expect(400);
});

it('returns an error if an invalid signingAuthWorkEmail is provided', async () => {
  await request(app)
    .post('/api/partner/signingauth')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      partnerSigningAuthStatus: KYCStatus.Unverified,
      signingAuthName: 'string',
      signingAuthWorkEmail: 'string',
      signingAuthTaxId: 'string',
      signingAuthTaxIdUrl: 'string',
      signingAuthTaxIdStatus: DocumentStatus.Unverified,
      signingAuthTitle: 'string',
      signingAuthLetterUrl: 'string',
      signingAuthLetterStatus: DocumentStatus.Unverified,
    })
    .expect(400);

  await request(app)
    .post('/api/partner/signingauth')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      partnerSigningAuthStatus: KYCStatus.Unverified,
      signingAuthName: 'string',
      signingAuthTaxId: 'string',
      signingAuthTaxIdUrl: 'string',
      signingAuthTaxIdStatus: DocumentStatus.Unverified,
      signingAuthTitle: 'string',
      signingAuthLetterUrl: 'string',
      signingAuthLetterStatus: DocumentStatus.Unverified,
    })
    .expect(400);
});

it('returns an error if an invalid signingAuthTaxId is provided', async () => {
  await request(app)
    .post('/api/partner/signingauth')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      partnerSigningAuthStatus: KYCStatus.Unverified,
      signingAuthName: 'string',
      signingAuthWorkEmail: 'string@string.com',
      signingAuthTaxId: '',
      signingAuthTaxIdUrl: 'string',
      signingAuthTaxIdStatus: DocumentStatus.Unverified,
      signingAuthTitle: 'string',
      signingAuthLetterUrl: 'string',
      signingAuthLetterStatus: DocumentStatus.Unverified,
    })
    .expect(400);

  await request(app)
    .post('/api/partner/signingauth')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      partnerSigningAuthStatus: KYCStatus.Unverified,
      signingAuthName: 'string',
      signingAuthWorkEmail: 'string@string.com',
      signingAuthTaxIdUrl: 'string',
      signingAuthTaxIdStatus: DocumentStatus.Unverified,
      signingAuthTitle: 'string',
      signingAuthLetterUrl: 'string',
      signingAuthLetterStatus: DocumentStatus.Unverified,
    })
    .expect(400);
});

it('creates a signingauth with valid inputs', async () => {
  let signingauth = await PartnerSigningAuth.find({});
  expect(signingauth.length).toEqual(0);

  await request(app)
    .post('/api/partner/signingauth')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      superuserId: new mongoose.Types.ObjectId().toHexString(),
      partnerType: PartnerType.MainBranch,
      partnerSigningAuthStatus: KYCStatus.Unverified,
      signingAuthName: 'string',
      signingAuthWorkEmail: 'string@string.com',
      signingAuthTaxId: 'string',
      signingAuthTaxIdUrl: 'string',
      signingAuthTaxIdStatus: DocumentStatus.Unverified,
      signingAuthTitle: 'string',
      signingAuthLetterUrl: 'string',
      signingAuthLetterStatus: DocumentStatus.Unverified,
    })
    .expect(201);

  signingauth = await PartnerSigningAuth.find({});
  expect(signingauth.length).toEqual(1);
  expect(signingauth[0].signingAuthLetterStatus).toEqual(DocumentStatus.Unverified);
});
