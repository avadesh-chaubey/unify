import { Publisher, Subjects, ConsultantInfoUpdatedEvent } from '@unifycaredigital/aem';

export class ConsultantInfoUpdatedPublisher extends Publisher<ConsultantInfoUpdatedEvent> {
  subject: Subjects.ConsultantInfoUpdated = Subjects.ConsultantInfoUpdated;
}
