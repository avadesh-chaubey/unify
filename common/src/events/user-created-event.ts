import { Subjects } from './subjects';
import { UserStatus } from '../types/user-status'
import { AccessLevel } from '../types/access-level';
import { PartnerType } from '../types/partner-type';
import { UserType } from '../types/user-type';

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
  data: {
    id: string;
    userFirstName: string;
    userLastName: string;
    emailId: string;
    phoneNumber: string;
    userType: UserType;
    partnerId: string;
    userStatus: UserStatus;
    accessLevel: AccessLevel,
    partnerType: PartnerType,
  };
}
