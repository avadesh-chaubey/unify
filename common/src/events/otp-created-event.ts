import { Subjects } from './subjects';
import { OTPType } from '../types/otp-type';

export interface OTPCreatedEvent {
  subject: Subjects.OTPCreated;
  data: {
    id: string;
    otpType: OTPType;
    expirationDate: Date;
    serialNumber: number;
  };
}
