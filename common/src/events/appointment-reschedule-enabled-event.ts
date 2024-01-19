import { Subjects } from './subjects';

export interface AppointmentRescheduleEnabledEvent {
  subject: Subjects.AppointmentRescheduleEnabled;
  data: {
    expirationDate: Date;
    appointmentId: string;
    serialNumber: number;
  };
}
