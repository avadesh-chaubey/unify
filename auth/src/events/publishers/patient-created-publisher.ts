import { Publisher, Subjects, PatientCreatedEvent } from '@unifycaredigital/aem';

export class PatientCreatedPublisher extends Publisher<PatientCreatedEvent> {
  subject: Subjects.PatientCreated = Subjects.PatientCreated;
}
