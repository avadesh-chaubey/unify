import { OrderStatus } from '../types/order-status';
import { OrderType } from '../types/order-type';
import { Subjects } from './subjects';

export interface OrderUpdatedEvent {
  subject: Subjects.OrderUpdated;
  data: {
    productId: string;
    priceInINR: number;
    patientId: string;
    parentId: string;
    status: OrderStatus;
    numberOfRetry: number;
    orderType: OrderType;
    expirationDate: Date;
    version: number;
  };
}
