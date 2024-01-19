import { Subjects } from './subjects';

export interface OrderExpiredEvent {
  subject: Subjects.OrderExpired;
  data: {
    patientId: string;
    productId: string;
  };
}
