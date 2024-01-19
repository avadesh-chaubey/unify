import { Subjects } from './subjects';
import { ConsultationType } from '../types/consultation-type'
import { AppointmentPaymentStatus } from '../types/appointment-payment-status'
import { OrderType } from '../types/order-type';
import { OrderStatus } from '../types/order-status';
import { AppointmentStatus } from '../types/appointment-status';

export interface AppointmentBookedEvent {
  subject: Subjects.AppointmentBooked;
  data: {
    appointmentId: string;
    consultantId: string;
    customerId: string;
    creatorId: string;
    partnerId: string;
    parentId: string;
    createdBy: string;
    basePriceInINR: number;
    consultationType: ConsultationType;
    appointmentDate: string;
    appointmentSlotId: number;
    appointmentStatus: AppointmentStatus;
    appointmentCreationTime: Date;
    orderType: OrderType;
    orderStatus: OrderStatus;
    assistantId: string;
    appointmentPaymentStatus: AppointmentPaymentStatus;
    assistantAppointmentDate: string;
    assistantAppointmentSlotId: string;
    assistantConsecutiveBookedSlots: number;
    appointmentRescheduleEnabled: boolean;
    arhOrderId: number;
    paymentMode: string;
    assistantNotRequired: boolean;
    appointmentType: string;
  };
}