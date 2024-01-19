import { Subjects } from './subjects';

export interface DatabaseCleanupEvent {
  subject: Subjects.DatabaseCleanup;
  data: {
    eventDateAndTime: Date;
  };
}