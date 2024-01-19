import { Publisher, Subjects, PartnerEmployeeStatusChangedEvent } from '@unifycaredigital/aem';

export class PartnerEmployeeStatusChangedPublisher extends Publisher<PartnerEmployeeStatusChangedEvent> {
  subject: Subjects.PartnerEmployeeStatusUpdated = Subjects.PartnerEmployeeStatusUpdated;
}
