import {
  Subjects,
  Publisher,
  AddConsultantAppointmentSlotsEvent,
} from '@unifycaredigital/aem';

export class AddConsultantAppointmentSlotsPublisher extends Publisher<
  AddConsultantAppointmentSlotsEvent
  > {
  subject: Subjects.AddConsultantAppointmentSlots = Subjects.AddConsultantAppointmentSlots;
}
