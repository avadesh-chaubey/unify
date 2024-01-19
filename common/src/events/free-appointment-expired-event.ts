import { ConsultationType } from '../types/consultation-type';
import { Subjects } from './subjects';

export interface FreeAppointmentExpiredEvent {
  subject: Subjects.FreeAppointmentExpired;
  data: {
    patientId: string;
    parentId: string;
    freeAppointmentList: [ConsultationType];
  };
}
