import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  OTPStatus,
  OTPType,
  EmailType,
  EmailTemplate,
  EmailDeliveryType,
  SMSType,
  SMSTemplate,
  BadRequestError,
  ApiResponse
} from '@unifycaredigital/aem';
import { OTPCreatedPublisher } from '../events/publishers/otp-created-publisher';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { SendNewSMSPublisher } from '../events/publishers/send-new-sms-publisher';
import { natsWrapper } from '../nats-wrapper';
import { EmailOTP } from '../models/email-otp';
import { PhoneOTP } from '../models/phone-otp';
import { User } from '../models/user-auth';
const router = express.Router();

// Calculate an expiration date for this otp
const EXPIRATION_WINDOW_SECONDS = 10 * 60;
const MIN_OTP_NUMBER = 1000;
const MXN_OTP_NUMBER = 10000;

router.post(
  '/api/users/sendphoneemailotp',
  [
    body('emailId').isEmail().withMessage('Email must be valid'),
    body('phoneNumber')
      .isLength({ min: 10, max: 10 })
      .withMessage('Phone Number must be 10 Digit'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { emailId, phoneNumber } = req.body;
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);


    const existingEmailId = await User.findOne({ emailId });
    if (existingEmailId) {
      throw new BadRequestError('Email already in use');
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw new BadRequestError('Phone Number already in use');
    }

    ///////Phone OTP ////////////////
    const phoneOTP = await PhoneOTP.findOne({ phoneNumber });
    let otp = Math.floor(Math.random() * (MXN_OTP_NUMBER - MIN_OTP_NUMBER)) + MIN_OTP_NUMBER;
    otp = 5555;
    let serialNumber = 0;
    if (phoneOTP) {
      phoneOTP.set({
        otp: otp,
        otpStatus: OTPStatus.Valid,
        serialNumber: phoneOTP.serialNumber + 1,
      });
      await phoneOTP.save();

      serialNumber = phoneOTP.serialNumber;
    } else {
      const user = PhoneOTP.build({ phoneNumber, otp: otp, otpStatus: OTPStatus.Valid, serialNumber, token: 'NA' });
      await user.save();
    }

    //////// Send SMS to  New User 
    new SendNewSMSPublisher(natsWrapper.client).publish({
      to: phoneNumber,
      body: `${otp} is your one time password for Rufous Login`,
      smsType: SMSType.OTP,
      smsTemplate: SMSTemplate.NoTemplate,
      generatedAt: new Date(),
    });


    ///// Publish New OTP Message //////////////
    new OTPCreatedPublisher(natsWrapper.client).publish({
      otpType: OTPType.Phone,
      id: phoneNumber,
      expirationDate: expiration,
      serialNumber,
    });

    ///////Email OTP ////////////////
    otp = Math.floor(Math.random() * (MXN_OTP_NUMBER - MIN_OTP_NUMBER)) + MIN_OTP_NUMBER;
    otp = 6666;
    const emailOTP = await EmailOTP.findOne({ emailId });
    serialNumber = 0;
    if (emailOTP) {
      emailOTP.set({
        otp: otp,
        otpStatus: OTPStatus.Valid,
        serialNumber: emailOTP.serialNumber + 1,
      });
      await emailOTP.save();
      serialNumber = emailOTP.serialNumber;
    } else {
      const user = EmailOTP.build({ emailId, otp: otp, otpStatus: OTPStatus.Valid, serialNumber });
      await user.save();
    }

    //////// Send Email to  New User 
    new SendNewEmailPublisher(natsWrapper.client).publish({
      to: emailId,
      cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
      bcc: '',
      from: String(process.env.SYSTEM_SENDER_EMAIL_ID),
      subject: `OTP from ${String(process.env.SYSTEM_SENDER_FULL_NAME)}`,
      body: `${otp} is your one time password for ${String(process.env.SYSTEM_SENDER_FULL_NAME)} Login`,
      emailType: EmailType.HtmlText,
      emailTemplate: EmailTemplate.NoTemplate,
      emaiDeliveryType: EmailDeliveryType.Immediate,
      atExactTime: new Date(),
    });

    ///// Publish New OTP Message //////////////
    new OTPCreatedPublisher(natsWrapper.client).publish({
      otpType: OTPType.Email,
      id: emailId,
      expirationDate: expiration,
      serialNumber,
    });

    res.sendStatus(200);
  }
);

export { router as sendPhoneEmailOTPRouter };
