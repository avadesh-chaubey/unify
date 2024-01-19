import { Publisher, Subjects, PartnerInformationCreatedEvent } from '@unifycaredigital/aem';

export class PartnerInformationCreatedPublisher extends Publisher<PartnerInformationCreatedEvent> {
  subject: Subjects.PartnerInformationCreated = Subjects.PartnerInformationCreated;
}
