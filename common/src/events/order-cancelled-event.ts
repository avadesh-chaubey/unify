import { Subjects } from './subjects';
import { OrderStatus } from '../types/order-status';

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    productId: string;
    patientId: string;
    parentId: string;
    status: OrderStatus;
    version: number;
  };
}