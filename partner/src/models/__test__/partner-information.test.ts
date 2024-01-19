import { PartnerInfo } from '../partner-information';
import mongoose from 'mongoose';
import { KYCStatus, DocumentStatus, PartnerType } from '@unifycaredigital/aem';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();
  const subuser = PartnerInfo.build({
    id,
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
    partnerId: new mongoose.Types.ObjectId().toHexString(),
  });

  // Save the profile to the database
  await subuser.save();

  // fetch the profile twice
  const firstInstance = await PartnerInfo.findById(subuser.id);
  const secondInstance = await PartnerInfo.findById(subuser.id);

  // make two separate changes to the profiles we fetched
  firstInstance!.set({ goodsAndServicesTaxIdStatus: DocumentStatus.Verified });
  secondInstance!.set({ partnerInfoStatus: KYCStatus.Verified });

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
  const partner = PartnerInfo.build({
    id,
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
    partnerId: new mongoose.Types.ObjectId().toHexString(),

  });

  await partner.save();
  expect(partner.version).toEqual(0);
  await partner.save();
  expect(partner.version).toEqual(1);
  await partner.save();
  expect(partner.version).toEqual(2);
});
