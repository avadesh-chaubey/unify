import { Publisher, Subjects, AppointmentUpdatedEvent } from '@unifycaredigital/aem';

export class AppointmentUpdatedPublisher extends Publisher<AppointmentUpdatedEvent> {
  subject: Subjects.AppointmentUpdated = Subjects.AppointmentUpdated;
}
