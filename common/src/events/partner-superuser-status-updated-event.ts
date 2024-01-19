import { Subjects } from './subjects';
import { UserStatus } from '../types/user-status'

export interface PartnerSuperuserStatusChangedEvent {
  subject: Subjects.PartnerSuperuserStatusUpdated;
  data: {
    id: string;
    userStatus: UserStatus;
  };
}
