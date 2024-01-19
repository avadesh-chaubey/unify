import { Subjects } from './subjects';
import { UserStatus } from '../types/user-status';
import { AccessLevel } from '../types/access-level';
import { UserType } from '../types/user-type';
import { DepartmentType } from '../types/department-type';
import { SpecializationType } from '../types/specialization-type';
import { GenderType } from '../types/gender-type';
import { LocationBasedFeeConfig } from '../types/loacation-based-fee-structure';

export interface ConsultantInfoUpdatedEvent {
  subject: Subjects.ConsultantInfoUpdated;
  data: {
    id: string;
    userFirstName: string;
    userMiddleName: string;
    userLastName: string;
    emailId: string;
    phoneNumber: string;
    partnerId: string;
    userStatus: UserStatus;
    genderType: GenderType;
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
    country: string;
    pin: string;
    consultationChargesInINR: number;
    locationBasedFeeConfig: [LocationBasedFeeConfig];
    doctorRegistrationNumber: string;
    about: string;
  };
}
