import { Subjects } from './subjects';
import { SMSType } from '../types/sms-type';
import { SMSTemplate } from '../types/sms-template';

export interface sendNewSMSEvent {
  subject: Subjects.SendNewSMS;
  data: {
    to: string;
    body: string;
    smsType: SMSType;
    smsTemplate: SMSTemplate;
    generatedAt: Date;
  };
}
