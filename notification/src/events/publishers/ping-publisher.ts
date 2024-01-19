import { Publisher, Subjects, PingServiceTwoEvent } from '@unifycaredigital/aem';

export class PingPublisher extends Publisher<PingServiceTwoEvent> {
  subject: Subjects.PingServiceTwo = Subjects.PingServiceTwo;
}
