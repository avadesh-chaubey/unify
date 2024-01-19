import { Subjects } from './subjects';
import { GenderType } from '../types/gender-type'

export interface PatientAddressUpdatedEvent {
  subject: Subjects.PatientAddressUpdated;
  data: {
    id: string;
    userFirstName: string;
    userLastName: string;
    emailId: string;
    phoneNumber: string;
    partnerId: string;
    dateOfBirth: string,
    gender: GenderType,
    address: string;
    city: string;
    state: string;
    pin: string;
  };
}
