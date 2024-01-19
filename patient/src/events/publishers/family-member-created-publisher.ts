import { Publisher, Subjects, FamilyMemberCreatedEvent } from '@unifycaredigital/aem';

export class FamilyMemberCreatedPublisher extends Publisher<FamilyMemberCreatedEvent> {
  subject: Subjects.FamilyMemberCreated = Subjects.FamilyMemberCreated;
}
