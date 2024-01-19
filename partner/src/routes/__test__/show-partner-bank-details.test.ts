import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserType, AccessLevel, UserStatus, DocumentStatus, KYCStatus, PartnerType } from '@unifycaredigital/aem';

it('returns a 404 if the partner bankdetails is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/partner/bankdetails/${id}`)
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send().expect(404);
});

it('returns the bankdetails if the bankdetails is found', async () => {
  const response = await request(app)
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

  const bankdetailsResponse = await request(app)
    .get(`/api/partner/bankdetails`)
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      response.body.id))
    .send()
    .expect(200);

  expect(bankdetailsResponse.body.bankAccountName).toEqual('string');
  expect(bankdetailsResponse.body.bankAccountNumber).toEqual('string');
});
