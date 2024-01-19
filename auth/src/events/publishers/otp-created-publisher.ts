import { Publisher, Subjects, OTPCreatedEvent } from '@unifycaredigital/aem';

export class OTPCreatedPublisher extends Publisher<OTPCreatedEvent> {
  subject: Subjects.OTPCreated = Subjects.OTPCreated;
}
