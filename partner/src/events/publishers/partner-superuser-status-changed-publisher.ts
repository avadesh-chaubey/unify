import { Publisher, Subjects, PartnerSuperuserStatusChangedEvent } from '@unifycaredigital/aem';

export class PartnerSuperuserStatusChangedPublisher extends Publisher<PartnerSuperuserStatusChangedEvent> {
  subject: Subjects.PartnerSuperuserStatusUpdated = Subjects.PartnerSuperuserStatusUpdated;
}
