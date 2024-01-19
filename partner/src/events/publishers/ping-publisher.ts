import { Publisher, Subjects, PingServiceFourEvent } from '@unifycaredigital/aem';

export class PingPublisher extends Publisher<PingServiceFourEvent> {
  subject: Subjects.PingServiceFour = Subjects.PingServiceFour;
}
