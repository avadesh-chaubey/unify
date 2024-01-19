import { PartnerSuperuser } from '../partner-superuser';
import mongoose from 'mongoose';
import { UserStatus, AccessLevel, UserType, PartnerType } from '@unifycaredigital/aem';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();
  const employee = PartnerSuperuser.build({
    id,
    userFirstName: 'Ashutosh',
    userLastName: 'Dhiman',
    emailId: 'ashutosh@test.com',
    phoneNumber: '6666666666',
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    userStatus: UserStatus.Active,
    accessLevel: AccessLevel.PartnerSuperuser,
    userType: UserType.PartnerSuperuser,
    partnerType: PartnerType.MainBranch,
  });

  // Save the profile to the database
  await employee.save();

  // fetch the profile twice
  const firstInstance = await PartnerSuperuser.findById(employee.id);
  const secondInstance = await PartnerSuperuser.findById(employee.id);

  // make two separate changes to the profiles we fetched
  firstInstance!.set({ phoneNumber: '1010101010' });
  secondInstance!.set({ phoneNumber: '1515151515' });

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
  const partner = PartnerSuperuser.build({
    id,
    userFirstName: 'Ashutosh',
    userLastName: 'Dhiman',
    emailId: 'ashutosh@test.com',
    phoneNumber: '6666666666',
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    userStatus: UserStatus.Active,
    accessLevel: AccessLevel.PartnerSuperuser,
    userType: UserType.PartnerSuperuser,
    partnerType: PartnerType.MainBranch,

  });

  await partner.save();
  expect(partner.version).toEqual(0);
  await partner.save();
  expect(partner.version).toEqual(1);
  await partner.save();
  expect(partner.version).toEqual(2);
});
