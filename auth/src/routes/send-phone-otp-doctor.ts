import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, OTPStatus, OTPType, SMSType, SMSTemplate, UserType, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { OTPCreatedPublisher } from '../events/publishers/otp-created-publisher';
import { SendNewSMSPublisher } from '../events/publishers/send-new-sms-publisher';
import { natsWrapper } from '../nats-wrapper';

import { PhoneOTP } from '../models/phone-otp';
import { User } from '../models/user-auth';

const router = express.Router();

// Calculate an expiration date for this otp
const EXPIRATION_WINDOW_SECONDS = 10 * 60;
const MIN_OTP_NUMBER = 1000;
const MXN_OTP_NUMBER = 10000;
const ANDROID_PATIENT_APP_HASH = "UNwCo0dhnWd";

router.post(
  '/api/users/sendphoneotpdoctor',
  [
    body('employeeId').trim().not().isEmpty()
      .withMessage('Please provide employeeId'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { employeeId } = req.body;

    let isExistingUser = false;

    const user = await User.findOne({ employeeId: employeeId });

    if (user) {
      isExistingUser = true;
    }

    if (!user) {
      throw new BadRequestError('Doctor not found!');
    }

    const phoneNumber = user.phoneNumber;

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
    // const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
    //   "&To=" + phoneNumber +
    //   "&TemplateName=" + SMSTemplate.IOSOTP +
    //   "&VAR1=" + otp; //+ "&VAR2=" + ANDROID_PATIENT_APP_HASH;

    const smsBody = 'Hi, your OTP to register for children vaccination is ' + otp + ' . Team Rainbow.';

    new SendNewSMSPublisher(natsWrapper.client).publish({
      to: phoneNumber.substring(0),
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

    const data = { message: 'OTP sent successfully!', phoneNumber: phoneNumber, isExistingUser: isExistingUser, UserType: user.userType };

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: data
    }
    res.status(200).send(apiResponse);
  }
);

export { router as sendPhoneOTPDoctorRouter };
