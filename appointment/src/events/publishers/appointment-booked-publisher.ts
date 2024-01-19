import { Publisher, Subjects, AppointmentBookedEvent } from '@unifycaredigital/aem';

export class AppointmentBookedPublisher extends Publisher<AppointmentBookedEvent> {
  subject: Subjects.AppointmentBooked = Subjects.AppointmentBooked;
}
