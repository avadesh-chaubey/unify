import { PartnerSigningAuth } from '../partner-signing-auth';
import mongoose from 'mongoose';
import { KYCStatus, DocumentStatus, PartnerType } from '@unifycaredigital/aem';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();
  const subuser = PartnerSigningAuth.build({
    id,
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
    partnerId: new mongoose.Types.ObjectId().toHexString(),
  });

  // Save the profile to the database
  await subuser.save();

  // fetch the profile twice
  const firstInstance = await PartnerSigningAuth.findById(subuser.id);
  const secondInstance = await PartnerSigningAuth.findById(subuser.id);

  // make two separate changes to the profiles we fetched
  firstInstance!.set({ signingAuthTaxIdStatus: DocumentStatus.Verified });
  secondInstance!.set({ signingAuthLetterStatus: DocumentStatus.Verified });

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
  const partner = PartnerSigningAuth.build({
    id,
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
    partnerId: new mongoose.Types.ObjectId().toHexString(),
  });

  await partner.save();
  expect(partner.version).toEqual(0);
  await partner.save();
  expect(partner.version).toEqual(1);
  await partner.save();
  expect(partner.version).toEqual(2);
});
