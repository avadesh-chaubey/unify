import { FollowupReminderType } from '../types/followup-reminder-type';
import { Subjects } from './subjects';

export interface FollowupReminderEvent {
  subject: Subjects.FollowupReminder;
  data: {
    followupReminderType: FollowupReminderType;
  };
}
