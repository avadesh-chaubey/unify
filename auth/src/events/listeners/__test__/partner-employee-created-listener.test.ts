import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { PartnerEmployeeCreatedEvent, UserType, AccessLevel, UserStatus, DepartmentType, SpecializationType } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { PartnerEmployeeCreatedListener } from '../partner-employee-created-listener';
import { User } from '../../../models/user-auth';

const setup = async () => {

  // Create an instance of the listener
  const listener = new PartnerEmployeeCreatedListener(natsWrapper.client);
  const id = new mongoose.Types.ObjectId().toHexString();

  // Create the fake data event
  const data: PartnerEmployeeCreatedEvent['data'] = {
    id,
    userFirstName: 'Ashutosh',
    userLastName: 'Dhiman',
    emailId: 'email@email.com',
    phoneNumber: '9876598765',
    userType: UserType.Doctor,
    partnerId: 'RUF00045',
    accessLevel: AccessLevel.Employee,
    userStatus: UserStatus.Active,
    dateOfBirth: '24-09-1980',
    experinceInYears: 16,
    qualificationList: ['btech'],
    department: DepartmentType.CustomerSupport,
    specialization: SpecializationType.Cardiology,
    profileImageName: 'string',
    designation: 'string',
    languages: ["Hindi"],
    city: 'string',
    state: 'string',
    country: 'string',
    pin: '123123',
    doctorRegistrationNumber: 'NA',
    employeeId: '12345'
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create new Hospital Employee', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const newHospital = await User.findById(data.id);

  expect(newHospital!.partnerId).toEqual('RUF00045');
  expect(newHospital!.userStatus).toEqual(UserStatus.Active);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
