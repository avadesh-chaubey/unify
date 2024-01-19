import {
  Subjects,
  Publisher,
  AppointmentRescheduleExpiredEvent,
} from '@unifycaredigital/aem';

export class AppointmentRescheduleExpirationPublisher extends Publisher<
  AppointmentRescheduleExpiredEvent
  > {
  subject: Subjects.AppointmentRescheduleExpired = Subjects.AppointmentRescheduleExpired;
}
