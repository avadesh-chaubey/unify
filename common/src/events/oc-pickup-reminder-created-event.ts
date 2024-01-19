import { Subjects } from './subjects';

export interface OCPickupReminderCreatedEvent {
  subject: Subjects.OCPickupReminderCreated;
  data: {
    requestId: string;
    expirationDate: Date;
  };
}
