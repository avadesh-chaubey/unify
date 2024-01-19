import { Publisher, Subjects, PingServiceOneEvent } from '@unifycaredigital/aem';

export class PingPublisher extends Publisher<PingServiceOneEvent> {
  subject: Subjects.PingServiceOne = Subjects.PingServiceOne;
}
