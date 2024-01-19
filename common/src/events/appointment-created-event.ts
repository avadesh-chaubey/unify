import { Subjects } from './subjects';

export interface AppointmentCreatedEvent {
  subject: Subjects.AppointmentCreated;
  data: {
    basePriceInINR: number,
    customerId: string;
    productId: string;
    parentId: string;
    expirationDate: Date;
  };
}
