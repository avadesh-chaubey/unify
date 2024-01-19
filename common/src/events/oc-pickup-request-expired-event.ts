import { Subjects } from './subjects';

export interface OCPickupRequestExpiredEvent {
  subject: Subjects.OCPickupRequestExpired;
  data: {
    requestId: string;
  };
}
