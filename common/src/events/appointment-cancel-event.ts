import { Subjects } from './subjects';

export interface AppointmentCancelEvent {
  subject: Subjects.AppointmentCancelled;
  data: {
    appointmentId: string;
  };
}
