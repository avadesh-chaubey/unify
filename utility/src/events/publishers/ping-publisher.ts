import { Publisher, Subjects, PingServiceSixEvent } from '@unifycaredigital/aem';

export class PingPublisher extends Publisher<PingServiceSixEvent> {
  subject: Subjects.PingServiceSix = Subjects.PingServiceSix;
}
