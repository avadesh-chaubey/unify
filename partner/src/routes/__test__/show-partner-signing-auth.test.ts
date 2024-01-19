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

it('returns a 404 if the partner signingauth is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/partner/signingauth/${id}`)
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send().expect(404);
});

it('returns the signingauth if the signingauth is found', async () => {
  const response = await request(app)
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

  const signingauthResponse = await request(app)
    .get(`/api/partner/signingauth`)
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      response.body.id))
    .send()
    .expect(200);

  expect(signingauthResponse.body.signingAuthName).toEqual('string');
  expect(signingauthResponse.body.signingAuthTaxId).toEqual('string');
});
