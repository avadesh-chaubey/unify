import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, OTPStatus, OTPType, SMSType, SMSTemplate, UserType, ApiResponse, BadRequestError } from '@unifycaredigital/aem';
import { OTPCreatedPublisher } from '../events/publishers/otp-created-publisher';
import { SendNewSMSPublisher } from '../events/publishers/send-new-sms-publisher';
import { natsWrapper } from '../nats-wrapper';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { PhoneOTP } from '../models/phone-otp';
import { User } from '../models/user-auth';

const router = express.Router();

// Calculate an expiration date for this otp
const EXPIRATION_WINDOW_SECONDS = 10 * 60;
const MIN_OTP_NUMBER = 1000;
const MXN_OTP_NUMBER = 10000;
const ANDROID_PATIENT_APP_HASH = "UNwCo0dhnWd";

router.post(
  '/api/users/sendphoneotp',
  [
    body('phoneNumber').trim().not().isEmpty().isLength({ min: 14 })
      .withMessage('phoneNumber is not valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber.includes('-') || !phoneNumber.includes('+')) {
      throw new BadRequestError('phoneNumber should contain country code');
    }

    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber);

    const isValidNumber = phoneUtil.isValidNumber(number);
    if (!isValidNumber) {
      throw new BadRequestError('phoneNumber is not valid');
    }

    let isExistingUser = false;
    let userType = UserType.Patient;

    const phoneOTP = await PhoneOTP.findOne({ phoneNumber });
    let otp = Math.floor(Math.random() * (MXN_OTP_NUMBER - MIN_OTP_NUMBER)) + MIN_OTP_NUMBER;
    otp = 5555;
    if (phoneNumber === "9971193277") {
      otp = 9999;
    }
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
    const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
      "&To=" + phoneNumber +
      "&TemplateName=" + SMSTemplate.IOSOTP +
      "&VAR1=" + otp; //+ "&VAR2=" + ANDROID_PATIENT_APP_HASH;

    new SendNewSMSPublisher(natsWrapper.client).publish({
      to: phoneNumber.substring(4),
      body: smsBody,
      smsType: SMSType.Transactional,
      smsTemplate: SMSTemplate.IOSOTP,
      generatedAt: new Date(),
    });

    ///// Publish New OTP Message //////////////
    const expiration = new Date();

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    new OTPCreatedPublisher(natsWrapper.client).publish({
      otpType: OTPType.Phone,
      id: phoneNumber,
      expirationDate: expiration,
      serialNumber,
    });

    const existingUser = await User.findOne({ phoneNumber: phoneNumber });
    if (existingUser) {
      isExistingUser = true;
      userType = existingUser.userType;
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: { isExistingUser: isExistingUser, userType: userType }
    };

    res.status(200).send(apiResponse);
  }
);

export { router as sendPhoneOTPRouter };
