import { Subjects } from './subjects';

export interface OCPickupReminderExpiredEvent {
  subject: Subjects.OCPickupReminderExpired;
  data: {
    requestId: string;
  };
}
