import {
  Subjects,
  Publisher,
  FollowupReminderEvent,
} from '@unifycaredigital/aem';

export class FollowupReminderPublisher extends Publisher<
  FollowupReminderEvent
> {
  subject: Subjects.FollowupReminder = Subjects.FollowupReminder;
}
