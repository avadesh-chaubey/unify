import { Subjects } from './subjects';
import { GenderType } from '../types/gender-type';
export interface PatientCreatedEvent {
  subject: Subjects.PatientCreated;
  data: {
    id: string;
    userFirstName: string;
    userLastName: string;
    emailId: string;
    phoneNumber: string;
    partnerId: string;
    dateOfBirth: string;
    gender: GenderType;
    languages: [string];
    address: string;
    city: string;
    state: string;
    pin: string;
    country: string;
    userMotherName: string;
    patientUID: string;
    patientPASID: string;
    ownerOrganisationUID: string;
    isVIP: boolean;
    nationality: string;
    statusFlag: string;
    seqName: string;
    registrationTimeAndDate: Date;
  };
}
