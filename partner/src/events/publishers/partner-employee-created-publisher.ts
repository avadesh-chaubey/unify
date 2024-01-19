import { Publisher, Subjects, PartnerEmployeeCreatedEvent } from '@unifycaredigital/aem';

export class PartnerEmployeeCreatedPublisher extends Publisher<PartnerEmployeeCreatedEvent> {
  subject: Subjects.PartnerEmployeeCreated = Subjects.PartnerEmployeeCreated;
}
