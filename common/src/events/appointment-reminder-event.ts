import { Subjects } from './subjects';

export interface AppointmentReminderEvent {
  subject: Subjects.AppointmentReminder;
  data: {
    appointmentId: string;
  };
}
