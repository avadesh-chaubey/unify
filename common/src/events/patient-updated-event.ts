import { Subjects } from './subjects';

export interface PatientUpdatedEvent {
  subject: Subjects.PatientUpdated;
  data: {
    id: string;
    emailId: string;
    phoneNumber: string;
    partnerId: string;
    userStatus: string;
  };
}
