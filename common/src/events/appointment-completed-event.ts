import { UserType } from '../types/user-type';
import { Subjects } from './subjects';

export interface AppointmentCompletedEvent {
  subject: Subjects.AppointmentCompleted;
  data: {
    appointmentId: string;
    successfullyCompleted: boolean,
    remarks: string,
    followupConsultationDate: Date,
    updatedBy: UserType,
  };
}
