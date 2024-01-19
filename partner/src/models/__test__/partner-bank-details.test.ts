import { PartnerBankDetails } from '../partner-bank-details';
import mongoose from 'mongoose';
import { KYCStatus, PartnerType, DocumentStatus } from '@unifycaredigital/aem';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();
  const subuser = PartnerBankDetails.build({
    id,
    superuserId: new mongoose.Types.ObjectId().toHexString(),
    partnerType: PartnerType.MainBranch,
    bankAccountName: 'string',
    bankAccountNumber: 'string',
    bankIFSCCode: 'string',
    bankName: 'string',
    bankChequeURL: 'string',
    bankChequeStatus: DocumentStatus.Unverified,
    partnerBankDetailsStatus: KYCStatus.Unverified,
    partnerId: new mongoose.Types.ObjectId().toHexString(),
  });

  // Save the profile to the database
  await subuser.save();

  // fetch the profile twice
  const firstInstance = await PartnerBankDetails.findById(subuser.id);
  const secondInstance = await PartnerBankDetails.findById(subuser.id);

  // make two separate changes to the profiles we fetched
  firstInstance!.set({ bankChequeStatus: DocumentStatus.Verified });
  secondInstance!.set({ partnerBankDetailsStatus: KYCStatus.Verified });

  // save the first fetched profile
  await firstInstance!.save();

  // save the second fetched profile and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const partner = PartnerBankDetails.build({
    id,
    superuserId: new mongoose.Types.ObjectId().toHexString(),
    partnerType: PartnerType.MainBranch,
    bankAccountName: 'string',
    bankAccountNumber: 'string',
    bankIFSCCode: 'string',
    bankName: 'string',
    bankChequeURL: 'string',
    bankChequeStatus: DocumentStatus.Unverified,
    partnerBankDetailsStatus: KYCStatus.Unverified,
    partnerId: new mongoose.Types.ObjectId().toHexString(),

  });

  await partner.save();
  expect(partner.version).toEqual(0);
  await partner.save();
  expect(partner.version).toEqual(1);
  await partner.save();
  expect(partner.version).toEqual(2);
});
