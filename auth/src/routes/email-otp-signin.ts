import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError, OTPStatus, UserStatus, ApiResponse } from '@unifycaredigital/aem';

import { User } from '../models/user-auth';
import { EmailOTP } from '../models/email-otp';

const router = express.Router();

router.post(
  '/api/users/emailotpsignin',
  [
    body('emailId').isEmail().withMessage('Email must be valid'),
    body('otp')
      .isLength({ min: 4, max: 4 })
      .withMessage('OTP Number must be 4 Digit'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { emailId, otp } = req.body;

    const emailOTP = await EmailOTP.findOne({ emailId });
    if (!emailOTP) {
      throw new BadRequestError('Invalid credentials');
    }

    if (emailOTP.otpStatus === OTPStatus.Valid) {
      if (otp != emailOTP.otp) {
        throw new BadRequestError('Invalid OTP');
      }
    } else {
      throw new BadRequestError('OTP Expired');
    }

    // OTP USES update OTP STATUS
    emailOTP.set({
      otpStatus: OTPStatus.Used,
    });

    await emailOTP.save();
    ///////////////////////////////// 

    const existingUser = await User.findOne({ emailId });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    if (existingUser.userStatus === UserStatus.Unverified) {
      existingUser.set({
        lastAuthAt: new Date(),
        userStatus: UserStatus.Verified
      });
    } else {
      existingUser.set({
        lastAuthAt: new Date(),
      });
    }

    await existingUser.save();


    // Generate JWT which Expires In 21 days
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

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

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
);

export { router as emailSigninRouter };
