import { Publisher, Subjects, ConsultantCreatedEvent } from '@unifycaredigital/aem';

export class ConsultantCreatedPublisher extends Publisher<ConsultantCreatedEvent> {
  subject: Subjects.ConsultantCreated = Subjects.ConsultantCreated;
}
