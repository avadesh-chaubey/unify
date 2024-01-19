import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, OTPStatus, ApiResponse } from '@unifycaredigital/aem';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { PhoneOTP } from '../models/phone-otp';
import short from 'short-uuid';

const router = express.Router();

router.post(
  '/api/users/phoneotpverify',
  [
    body('phoneNumber').trim().not().isEmpty().isLength({ min: 14 })
      .withMessage('phoneNumber is not valid'),
    body('otp')
      .isLength({ min: 4, max: 4 })
      .withMessage('OTP Number must be 4 Digit'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { phoneNumber, otp } = req.body;

    if (!phoneNumber.includes('-') || !phoneNumber.includes('+')) {
      throw new BadRequestError('phoneNumber should contain country code');
    }

    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber);

    const isValidNumber = phoneUtil.isValidNumber(number);
    if (!isValidNumber) {
      throw new BadRequestError('phoneNumber is not valid');
    }
    const phoneOTP = await PhoneOTP.findOne({ phoneNumber });
    if (!phoneOTP) {
      throw new BadRequestError('Invalid credentials');
    }

    if (phoneOTP.otpStatus === OTPStatus.Valid) {
      if (otp != phoneOTP.otp) {
        throw new BadRequestError('Invalid OTP');
      }
    } else {
      throw new BadRequestError('OTP Expired');
    }
    const token = short.uuid();

    // OTP USES update OTP STATUS
    phoneOTP.set({
      otpStatus: OTPStatus.Used,
      token: token
    });

    await phoneOTP.save();
    const data = {
      phoneNumber: phoneNumber,
      token: token
    };

    const apiResposne: ApiResponse = {
      status: 200,
      message: 'Success',
      data: data
    }

    res.status(200).send(apiResposne);

  }
);

export { router as phoneVerifyRouter };
