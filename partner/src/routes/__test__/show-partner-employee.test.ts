import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserType, AccessLevel, UserStatus, DepartmentType, GenderType, SpecializationType } from '@unifycaredigital/aem';

it('returns a 404 if the partner employee is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/partner/employee/${id}`)
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send().expect(404);
});

it('returns the employee if the employee is found', async () => {
  const response = await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
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
      isConsultant: true
    })
    .expect(201);

  const employeeResponse = await request(app)
    .get(`/api/partner/employee/${response.body.id}`)
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send()
    .expect(200);

  expect(employeeResponse.body.userFirstName).toEqual('Mr. Ashutosh');
  expect(employeeResponse.body.emailId).toEqual('ashutosh@test.com');
});
