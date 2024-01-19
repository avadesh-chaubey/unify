import { Publisher, Subjects, SendNotificationEvent } from '@unifycaredigital/aem';

export class SendNotificationPublisher extends Publisher<SendNotificationEvent> {
  subject: Subjects.SendNotification = Subjects.SendNotification;
}
