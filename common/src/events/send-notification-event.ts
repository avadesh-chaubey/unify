import { Subjects } from './subjects';
import { NotificationType } from '../types/notification-type'

export interface SendNotificationEvent {
  subject: Subjects.SendNotification;
  data: {
    to: [string];
    title: string;
    body: string;
    type: NotificationType;
    url: string;
    key: string;
    sendDateAndTime: Date;
  };
}