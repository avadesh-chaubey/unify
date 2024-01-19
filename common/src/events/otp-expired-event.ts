import { Subjects } from './subjects';
import { OTPType } from '../types/otp-type';

export interface OTPExpiredEvent {
  subject: Subjects.OTPExpired;
  data: {
    id: string;
    otpType: OTPType;
    serialNumber: number;
  };
}
