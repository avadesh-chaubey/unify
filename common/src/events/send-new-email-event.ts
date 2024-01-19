import { Subjects } from './subjects';
import { EmailType } from '../types/email-type';
import { EmailTemplate } from '../types/email-template';
import { EmailDeliveryType } from '../types/email-delivery-type';

export interface sendNewEmailEvent {
  subject: Subjects.SendNewEmail;
  data: {
    to: string;
    cc: string;
    bcc: string,
    from: string;
    subject: string;
    body: string;
    emailType: EmailType;
    emailTemplate: EmailTemplate;
    emaiDeliveryType: EmailDeliveryType;
    atExactTime: Date;   //Only relevant if AtExactTime is selected in Delivery Type
  };
}
