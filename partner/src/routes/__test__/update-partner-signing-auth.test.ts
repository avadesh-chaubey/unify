import request from 'supertest';
import { app } from '../../app';
import { PartnerSigningAuth } from '../../models/partner-signing-auth'
import { DocumentStatus, KYCStatus } from '@unifycaredigital/aem';
import { UserStatus, UserType, AccessLevel, PartnerType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

it('has a route handler listening to /api/partner/signingauth for post requests', async () => {
  const response = await request(app)
    .put('/api/partner/signingauth')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .put('/api/partner/signingauth')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .put('/api/partner/signingauth')
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
    .post('/api/partner/signingauth')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      eid))
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

  await request(app)
    .put('/api/partner/signingauth')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      eid))
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
      signingAuthLetterStatus: DocumentStatus.Verified,
    })
    .expect(200);

  const updatedPartnerSubuser = await PartnerSigningAuth.findById(response.body.id,);
  expect(updatedPartnerSubuser!.signingAuthLetterStatus).toEqual(DocumentStatus.Unverified);
});
