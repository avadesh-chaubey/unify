import { Subjects } from './subjects';
import { UserStatus } from '../types/user-status'

export interface PartnerEmployeeStatusChangedEvent {
  subject: Subjects.PartnerEmployeeStatusUpdated;
  data: {
    id: string;
    userStatus: UserStatus;
  };
}
