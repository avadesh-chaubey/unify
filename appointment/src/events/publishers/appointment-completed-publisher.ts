import { Publisher, Subjects, AppointmentCompletedEvent } from '@unifycaredigital/aem';

export class AppointmentCompletedPublisher extends Publisher<AppointmentCompletedEvent> {
  subject: Subjects.AppointmentCompleted = Subjects.AppointmentCompleted;
}
