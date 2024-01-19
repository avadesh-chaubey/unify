import { Subjects } from './subjects';

export interface AddConsultantAppointmentSlotsEvent {
  subject: Subjects.AddConsultantAppointmentSlots;
  data: {
    message: string;
  };
}
