import {
  Subjects,
  Publisher,
  AppointmentReminderEvent,
} from '@unifycaredigital/aem';

export class AppointmentReminderPublisher extends Publisher<
  AppointmentReminderEvent
> {
  subject: Subjects.AppointmentReminder = Subjects.AppointmentReminder;
}
