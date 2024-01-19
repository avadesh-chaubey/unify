import { Subjects } from './subjects';

export interface PaymentCompletedEvent {
  subject: Subjects.PaymentCompleted;
  data: {
    productId: string;
    payment_id: string;
    version: number;
    arhOrderId: number;
    paymentMode: string;
  };
}
