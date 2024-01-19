import { Publisher, Subjects, AppointmentRescheduleEnabledEvent } from '@unifycaredigital/aem';

export class AppointmentRescheduleEnabledPublisher extends Publisher<AppointmentRescheduleEnabledEvent> {
  subject: Subjects.AppointmentRescheduleEnabled = Subjects.AppointmentRescheduleEnabled;
}
