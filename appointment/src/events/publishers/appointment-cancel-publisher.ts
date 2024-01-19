import { Publisher, Subjects, AppointmentCancelEvent } from '@unifycaredigital/aem';

export class AppointmentCancelPublisher extends Publisher<AppointmentCancelEvent> {
  subject: Subjects.AppointmentCancelled = Subjects.AppointmentCancelled;
}
