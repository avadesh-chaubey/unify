import { followupReminderGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, Subjects, FollowupReminderEvent, FollowupReminderType, SMSType, SMSTemplate } from '@unifycaredigital/aem';
import { natsWrapper } from '../../nats-wrapper';
import moment from 'moment';
import { SendNewSMSPublisher } from '../publishers/send-new-sms-publisher';
import { FollowupReminder } from '../../models/followup-appointment-reminder';

export class FollowupReminderListener extends Listener<FollowupReminderEvent> {
  subject: Subjects.FollowupReminder = Subjects.FollowupReminder;
  queueGroupName = followupReminderGroupName;

  async onMessage(data: FollowupReminderEvent['data'], msg: Message) {

    const today = moment().utcOffset(330).format('YYYY-MM-DD');

    if (data.followupReminderType === FollowupReminderType.Today) {
      let reminderCount = await FollowupReminder.find({
        followupReminderDate: today,
        followupReminderType: FollowupReminderType.Today
      }).countDocuments();
      for (let i = 0; i < reminderCount; i++) {
        const reminder = await FollowupReminder.findOneAndDelete({
          followupReminderDate: today,
          followupReminderType: FollowupReminderType.Today
        });
        if (reminder) {
          //////// Send SMS to  patient about booking reminder 
          const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
            "&To=" + reminder.parentPhoneNumber +
            "&TemplateName=" + SMSTemplate.FOLLOWUP_APPOINTMENT_REMINDER +
            "&VAR1=" + reminder.customerName +
            "&VAR2=" + `${reminder.consultantName} today`;
          new SendNewSMSPublisher(natsWrapper.client).publish({
            to: reminder.parentPhoneNumber,
            body: smsBody,
            smsType: SMSType.Transactional,
            smsTemplate: SMSTemplate.FOLLOWUP_APPOINTMENT_REMINDER,
            generatedAt: new Date(),
          });
        }
      }
    } else if (data.followupReminderType === FollowupReminderType.SevenDaysBefore) {
      let reminderCount = await FollowupReminder.find({
        followupReminderDate: today,
        followupReminderType: FollowupReminderType.SevenDaysBefore
      }).countDocuments();
      for (let i = 0; i < reminderCount; i++) {
        const reminder = await FollowupReminder.findOneAndDelete({
          followupReminderDate: today,
          followupReminderType: FollowupReminderType.SevenDaysBefore
        });
        if (reminder) {
          //////// Send SMS to  patient about booking reminder 
          const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
            "&To=" + reminder.parentPhoneNumber +
            "&TemplateName=" + SMSTemplate.FOLLOWUP_APPOINTMENT_REMINDER +
            "&VAR1=" + reminder.customerName +
            "&VAR2=" + `${reminder.consultantName} in next 7 days`;
          new SendNewSMSPublisher(natsWrapper.client).publish({
            to: reminder.parentPhoneNumber,
            body: smsBody,
            smsType: SMSType.Transactional,
            smsTemplate: SMSTemplate.FOLLOWUP_APPOINTMENT_REMINDER,
            generatedAt: new Date(),
          });
        }
      }
    } else {
      let reminderCount = await FollowupReminder.find({
        followupReminderDate: today,
        followupReminderType: FollowupReminderType.ThreeDaysBefore
      }).countDocuments();
      for (let i = 0; i < reminderCount; i++) {
        const reminder = await FollowupReminder.findOneAndDelete({
          followupReminderDate: today,
          followupReminderType: FollowupReminderType.ThreeDaysBefore
        });
        if (reminder) {
          //////// Send SMS to  patient about booking reminder 
          const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
            "&To=" + reminder.parentPhoneNumber +
            "&TemplateName=" + SMSTemplate.FOLLOWUP_APPOINTMENT_REMINDER +
            "&VAR1=" + reminder.customerName +
            "&VAR2=" + `${reminder.consultantName} in next 3 days`;
          new SendNewSMSPublisher(natsWrapper.client).publish({
            to: reminder.parentPhoneNumber,
            body: smsBody,
            smsType: SMSType.Transactional,
            smsTemplate: SMSTemplate.FOLLOWUP_APPOINTMENT_REMINDER,
            generatedAt: new Date(),
          });
        }
      }
    }

    msg.ack();
  }
}
