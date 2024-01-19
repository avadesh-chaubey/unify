import { Publisher, Subjects, PingServiceFiveEvent } from '@unifycaredigital/aem';

export class PingPublisher extends Publisher<PingServiceFiveEvent> {
  subject: Subjects.PingServiceFive = Subjects.PingServiceFive;
}
