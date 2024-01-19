import { Subjects } from './subjects';

export interface OCPickupRequestCreatedEvent {
  subject: Subjects.OCPickupRequestCreated;
  data: {
    requestId: string;
    expirationDate: Date;
  };
}
