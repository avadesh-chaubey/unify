import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError, OTPStatus, ApiResponse } from '@unifycaredigital/aem';

import { User } from '../models/user-auth';
import { PhoneOTP } from '../models/phone-otp';
import { PhoneNumberUtil } from 'google-libphonenumber';

const router = express.Router();

router.post(
  '/api/users/phoneotpsignin',
  [
    body('phoneNumber').trim().not().isEmpty().isLength({ min: 14 })
      .withMessage('phoneNumber is not valid'),
    body('otp')
      .isLength({ min: 4, max: 4 })
      .withMessage('OTP Number must be 4 Digit'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { phoneNumber, otp, isMobileClient } = req.body;

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

    // OTP USES update OTP STATUS
    phoneOTP.set({
      otpStatus: OTPStatus.Used,
    });

    await phoneOTP.save();
    ///////////////////////////////// 

    const existingUser = await User.findOne({ phoneNumber });
    if (!existingUser) {
      throw new BadRequestError('Not A Registered User');
    }

    existingUser.set({
      lastAuthAt: new Date(),
    });

    await existingUser.save();


    // Generate JWT which Expires In 1 hour
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        emd: existingUser.emailId,
        phn: existingUser.phoneNumber,
        uty: existingUser.userType,
        fid: existingUser.partnerId,
        alv: existingUser.accessLevel,
        ust: existingUser.userStatus,
      },
      process.env.JWT_KEY!, { expiresIn: 21 * 24 * 60 * 60 }
    );

    if (!isMobileClient) {
      // Store it on session object
      req.session = {
        jwt: userJwt,
      };

      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: existingUser
      };

      res.status(200).send(apiResponse);
    } else {
      const user = {
        id: existingUser.id,
        userFirstName: existingUser.userFirstName,
        userLastName: existingUser.userLastName,
        emailId: existingUser.emailId,
        phoneNumber: existingUser.phoneNumber,
        userType: existingUser.userType,
        partnerId: existingUser.partnerId,
        token: userJwt
      };

      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: user
      };

      res.status(200).send(apiResponse);
    }
  }
);

export { router as phoneSigninRouter };
