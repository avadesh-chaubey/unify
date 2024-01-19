import { PartnerEmployee } from '../partner-employee';
import mongoose from 'mongoose';
import { UserStatus, AccessLevel, UserType, DepartmentType, SpecializationType, GenderType, LocationBasedFeeConfig } from '@unifycaredigital/aem';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const locationBasedFeeConfig: [LocationBasedFeeConfig] = [
    {
      country: 'ANY',
      state: 'ANY',
      city: 'ANY',
      locationConfig: 'ANY#ANY#ANY',
      flatFees: 500,
      feeInPercentage: 100
    }
  ];
  const id = new mongoose.Types.ObjectId().toHexString();
  const employee = PartnerEmployee.build({
    id,
    title: 'Mr.',
    userFirstName: 'Ashutosh',
    userMiddleName: '',
    userLastName: 'Dhiman',
    emailId: 'ashutosh@test.com',
    phoneNumber: '6666666666',
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    userStatus: UserStatus.Active,
    accessLevel: AccessLevel.Employee,
    genderType: GenderType.Male,
    userType: UserType.Doctor,
    dateOfBirth: '24-09-1980',
    experinceInYears: 16,
    qualificationList: ['btech'],
    doctorRegistrationNumber: 'NA',
    department: DepartmentType.CustomerSupport,
    specialization: SpecializationType.Cardiology,
    profileImageName: 'string',
    designation: 'string',
    onboardingDate: new Date(),
    languages: ["Hindi"],
    panNumber: "string",
    panUrl: 'string',
    address: 'string',
    city: 'Gurgaon',
    state: 'string',
    country: 'string',
    pin: 'string',
    addressProofNumber: 'string',
    addressProofUrl: 'string',
    consultationChargesInINR: 500,
    isConsultant: true,
    locationBasedFeeConfig: locationBasedFeeConfig
  });

  // Save the profile to the database
  await employee.save();

  // fetch the profile twice
  const firstInstance = await PartnerEmployee.findById(employee.id);
  const secondInstance = await PartnerEmployee.findById(employee.id);

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
const locationBasedFeeConfig: [LocationBasedFeeConfig] = [
  {
    country: 'ANY',
    state: 'ANY',
    city: 'ANY',
    locationConfig: 'ANY#ANY#ANY',
    flatFees: 500,
    feeInPercentage: 100
  }
];
it('increments the version number on multiple saves', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const partner = PartnerEmployee.build({
    id,
    title: 'Mr.',
    userFirstName: 'Ashutosh',
    userMiddleName: "",
    userLastName: 'Dhiman',
    emailId: 'ashutosh@test.com',
    phoneNumber: '6666666666',
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    userStatus: UserStatus.Active,
    accessLevel: AccessLevel.Employee,
    genderType: GenderType.Male,
    userType: UserType.Doctor,
    dateOfBirth: '24-09-1980',
    experinceInYears: 16,
    qualificationList: ['btech'],
    doctorRegistrationNumber: 'NA',
    department: DepartmentType.CustomerSupport,
    specialization: SpecializationType.Cardiology,
    profileImageName: 'string',
    designation: 'string',
    onboardingDate: new Date(),
    languages: ["Hindi"],
    panNumber: "string",
    panUrl: 'string',
    address: 'string',
    city: 'Gurgaon',
    state: 'string',
    country: 'string',
    pin: 'string',
    addressProofNumber: 'string',
    addressProofUrl: 'string',
    consultationChargesInINR: 500,
    isConsultant: true,
    locationBasedFeeConfig: locationBasedFeeConfig
  });

  await partner.save();
  expect(partner.version).toEqual(0);
  await partner.save();
  expect(partner.version).toEqual(1);
  await partner.save();
  expect(partner.version).toEqual(2);
});
