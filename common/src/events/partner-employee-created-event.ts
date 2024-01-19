import { Subjects } from './subjects';
import { UserStatus } from '../types/user-status';
import { AccessLevel } from '../types/access-level';
import { UserType } from '../types/user-type';
import { DepartmentType } from '../types/department-type';
import { SpecializationType } from '../types/specialization-type';

export interface PartnerEmployeeCreatedEvent {
  subject: Subjects.PartnerEmployeeCreated;
  data: {
    id: string;
    userFirstName: string;
    userLastName: string;
    emailId: string;
    phoneNumber: string;
    partnerId: string;
    userStatus: UserStatus;
    accessLevel: AccessLevel;
    dateOfBirth: string;
    experinceInYears: number;
    qualificationList: [string];
    userType: UserType;
    department: DepartmentType;
    specialization: SpecializationType;
    profileImageName: string;
    designation: string;
    languages: [string];
    city: string;
    state: string;
    pin: string;
    country: string;
    doctorRegistrationNumber: string;
    employeeId: string;
    organization: string;
    organizationUID: string;
    specialityUID: string;
  };
}
