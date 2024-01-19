import request from 'supertest';
import { app } from '../../app';
import { PartnerEmployee } from '../../models/partner-employee'
import { natsWrapper } from '../../nats-wrapper';
import { UserStatus, UserType, AccessLevel, GenderType, DepartmentType, SpecializationType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

it('has a route handler listening to /api/partner/employee for post requests', async () => {
  const response = await request(app)
    .post('/api/partner/employee')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/partner/employee')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid userName is provided', async () => {
  await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      userFirstName: '',
      userLastName: 'New User',
      emailId: 'test@rufous.com',
      phoneNumber: '1234567890',
    })
    .expect(400);

  await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      userLastName: 'New User',
      emailId: 'test@rufous.com',
      phoneNumber: '1234567890',
    })
    .expect(400);
});

it('returns an error if an invalid email is provided', async () => {
  await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      userFirstName: 'New User',
      userLastName: 'New User',
      emailId: 'email',
      phoneNumber: '1234567890',
    })
    .expect(400);

  await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      userFirstName: 'New User',
      userLastName: 'New User',
      phoneNumber: '1234567890',
    })
    .expect(400);
});

it('returns an error if an invalid phoneNumber is provided', async () => {
  await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      userFirstName: 'New User',
      userLastName: 'New User',
      emailId: 'email@email.com',
    })
    .expect(400);

  await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      userFirstName: 'New User',
      userLastName: 'New User',
      emailId: 'email@email.com',
      phoneNumber: '123890',
    })
    .expect(400);

  await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      userFirstName: 'New User',
      userLastName: 'New User',
      emailId: 'email@email.com',
      phoneNumber: '12345678900000',
    })
    .expect(400);
});

it('creates a employee with valid inputs', async () => {
  let employee = await PartnerEmployee.find({});
  expect(employee.length).toEqual(0);

  await request(app)
    .post('/api/partner/employee')
    .set('Cookie', global.signin(UserType.PartnerSuperuser,
      AccessLevel.PartnerSuperuser,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      userFirstName: 'New User',
      userLastName: 'New User',
      emailId: 'email@email.com',
      phoneNumber: '1234567890',
      userType: UserType.Doctor,
      dateOfBirth: '24-09-1980',
      experinceInYears: 10,
      highestQualification: 'btech',
      department: DepartmentType.CustomerSupport,
      specialization: SpecializationType.Cardiology,
      profileImageName: 'string',
      designation: 'string'
    })
    .expect(201);

  employee = await PartnerEmployee.find({});
  expect(employee.length).toEqual(1);
  expect(employee[0].userStatus).toEqual(UserStatus.Verified);
});

it('publishes an event', async () => {

  await request(app)
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

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});


