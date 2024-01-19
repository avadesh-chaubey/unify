import { Subjects } from './subjects';

export interface AppointmentRescheduleExpiredEvent {
  subject: Subjects.AppointmentRescheduleExpired;
  data: {
    appointmentId: string;
    serialNumber: number;
  };
}
