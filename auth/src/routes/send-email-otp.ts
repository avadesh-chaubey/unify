import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  OTPStatus,
  OTPType,
  EmailType,
  EmailTemplate,
  EmailDeliveryType,
  ApiResponse
} from '@unifycaredigital/aem';
import { OTPCreatedPublisher } from '../events/publishers/otp-created-publisher';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { natsWrapper } from '../nats-wrapper';
import { EmailOTP } from '../models/email-otp';

const router = express.Router();

// Calculate an expiration date for this otp
const EXPIRATION_WINDOW_SECONDS = 10 * 60;
const MIN_OTP_NUMBER = 1000;
const MXN_OTP_NUMBER = 10000;

router.post(
  '/api/users/sendemailotp',
  [
    body('emailId').isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { emailId } = req.body;

    const emailOTP = await EmailOTP.findOne({ emailId });
    let serialNumber = 0;
    let otp = Math.floor(Math.random() * (MXN_OTP_NUMBER - MIN_OTP_NUMBER)) + MIN_OTP_NUMBER;
    otp = 6666;
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
      atExactTime: new Date()
    });

    ///// Publish New OTP Message //////////////
    const expiration = new Date();

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    new OTPCreatedPublisher(natsWrapper.client).publish({
      otpType: OTPType.Email,
      id: emailId,
      expirationDate: expiration,
      serialNumber,
    });

    res.sendStatus(200);
  }
);

export { router as sendEmailOTPRouter };
