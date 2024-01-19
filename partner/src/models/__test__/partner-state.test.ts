import { PartnerState } from '../partner-state';
import mongoose from 'mongoose';
import { PartnerType, PartnerStates } from '@unifycaredigital/aem';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();
  const subuser = PartnerState.build({
    id,
    superuserId: new mongoose.Types.ObjectId().toHexString(),
    partnerType: PartnerType.MainBranch,
    currentState: PartnerStates.AddPartnerInformation,
    partnerId: new mongoose.Types.ObjectId().toHexString(),
  });

  // Save the profile to the database
  await subuser.save();

  // fetch the profile twice
  const firstInstance = await PartnerState.findById(subuser.id);
  const secondInstance = await PartnerState.findById(subuser.id);

  // make two separate changes to the profiles we fetched
  firstInstance!.set({ currentState: PartnerStates.AddPartnerBankingDetails });
  secondInstance!.set({ currentState: PartnerStates.AddPartnerSigningAuth });

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
  const partner = PartnerState.build({
    id,
    superuserId: new mongoose.Types.ObjectId().toHexString(),
    partnerType: PartnerType.MainBranch,
    currentState: PartnerStates.AddPartnerInformation,
    partnerId: new mongoose.Types.ObjectId().toHexString(),

  });

  await partner.save();
  expect(partner.version).toEqual(0);
  await partner.save();
  expect(partner.version).toEqual(1);
  await partner.save();
  expect(partner.version).toEqual(2);
});
