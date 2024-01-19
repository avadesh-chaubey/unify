import { Publisher, Subjects, PingServiceThreeEvent } from '@unifycaredigital/aem';

export class PingPublisher extends Publisher<PingServiceThreeEvent> {
  subject: Subjects.PingServiceThree = Subjects.PingServiceThree;
}
