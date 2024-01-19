import { Subjects } from './subjects';

export interface AppointmentExpiredEvent {
  subject: Subjects.AppointmentExpired;
  data: {
    customerId: string;
    productId: string;
  };
}
