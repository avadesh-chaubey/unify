import { Publisher, Subjects, sendNewSMSEvent } from '@unifycaredigital/aem';

export class SendNewSMSPublisher extends Publisher<sendNewSMSEvent> {
  subject: Subjects.SendNewSMS = Subjects.SendNewSMS;
}
