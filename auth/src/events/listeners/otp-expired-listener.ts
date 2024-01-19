import { Listener, OTPExpiredEvent, Subjects, OTPStatus, NotFoundError, OTPType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { PhoneOTP } from '../../models/phone-otp';
import { EmailOTP } from '../../models/email-otp';
import { otpExpiredGroupName } from './queue-group-name';

export class OTPExpiredListener extends Listener<OTPExpiredEvent> {
  subject: Subjects.OTPExpired = Subjects.OTPExpired;
  queueGroupName = otpExpiredGroupName;

  async onMessage(data: OTPExpiredEvent['data'], msg: Message) {
    console.log('OTPExpiredEvent for id: ', data.id);

    if (data.otpType === OTPType.Phone) {
      const phoneOTP = await PhoneOTP.findOne({ phoneNumber: data.id });
      if (!phoneOTP) {
        console.log('Phone OTP Not Found with ID: ', data.id);
        msg.ack();
        return;
      }
      if (phoneOTP.otpStatus === OTPStatus.Valid && phoneOTP.serialNumber == data.serialNumber) {
        phoneOTP.set({
          otpStatus: OTPStatus.Expired,
        });
        await phoneOTP.save();
      } else {
        console.log('Phone OTP Not Valid');
      }

    } else {
      const emailOTP = await EmailOTP.findOne({ emailId: data.id });
      if (!emailOTP) {
        console.log('Email OTP Not Found with ID: ', data.id);
        msg.ack();
        return;
      }
      if (emailOTP.otpStatus === OTPStatus.Valid && emailOTP.serialNumber == data.serialNumber) {
        emailOTP.set({
          otpStatus: OTPStatus.Expired,
        });
        await emailOTP.save();
      } else {
        console.log('Email OTP Not Valid');
      }

    }
    msg.ack();
  }
};
