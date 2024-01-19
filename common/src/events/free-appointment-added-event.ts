import { ConsultationType } from '../types/consultation-type';
import { Subjects } from './subjects';

export interface FreeAppointmentAddedEvent {
  subject: Subjects.FreeAppointmentAdded;
  data: {
    patientId: string;
    parentId: string;
    freeAppointmentList: [ConsultationType];
    expirationDate: Date;
  };
}
