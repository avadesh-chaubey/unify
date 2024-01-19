import request from 'supertest';
import { app } from '../../app';
import { PartnerEmployee } from '../../models/partner-employee'
import { natsWrapper } from '../../nats-wrapper';
import { PartnerStatus } from '@unifycaredigital/aem';
import { UserStatus, UserType, AccessLevel, DepartmentType, GenderType, SpecializationType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

it('has a route handler listening to /api/partner/employeestatus for post requests', async () => {
  const response = await request(app)
    .put('/api/partner/employeestatus')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .put('/api/partner/employeestatus')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .put('/api/partner/employeestatus')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('update partner status with valid inputs', async () => {

  const response = await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
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

  await request(app)
    .put('/api/partner/employeestatus')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      id: response.body.id,
      userStatus: UserStatus.Suspended,
    })
    .expect(200);

  const updatedPartnerEmployee = await PartnerEmployee.findById(response.body.id,);
  expect(updatedPartnerEmployee!.userStatus).toEqual(PartnerStatus.Suspended);
});


it('publishes an event', async () => {

  const response = await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
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

  await request(app)
    .put('/api/partner/employeestatus')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      id: response.body.id,
      userStatus: UserStatus.Suspended,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

