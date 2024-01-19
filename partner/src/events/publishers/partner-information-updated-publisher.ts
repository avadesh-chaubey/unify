import { Publisher, Subjects, PartnerInformationUpdatedEvent } from '@unifycaredigital/aem';

export class PartnerInformationUpdatedPublisher extends Publisher<PartnerInformationUpdatedEvent> {
  subject: Subjects.PartnerInformationUpdated = Subjects.PartnerInformationUpdated;
}
