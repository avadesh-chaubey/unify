import { Publisher, Subjects, PingEvent } from '@unifycaredigital/aem';

export class PingPublisher extends Publisher<PingEvent> {
  subject: Subjects.Ping = Subjects.Ping;
}
