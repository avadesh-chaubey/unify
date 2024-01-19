import { Publisher, Subjects, sendNewEmailEvent } from '@unifycaredigital/aem';

export class SendNewEmailPublisher extends Publisher<sendNewEmailEvent> {
  subject: Subjects.SendNewEmail = Subjects.SendNewEmail;
}
