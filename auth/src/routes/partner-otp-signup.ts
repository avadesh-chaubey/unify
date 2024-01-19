import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import {
  validateRequest,
  BadRequestError,
  UserStatus,
  UserType,
  OTPStatus,
  AccessLevel,
  EmailType,
  EmailTemplate,
  EmailDeliveryType,
  PartnerType
} from '@unifycaredigital/aem';

import mongoose from 'mongoose';
import { User } from '../models/user-auth';
import { PhoneOTP } from '../models/phone-otp';
import { EmailOTP } from '../models/email-otp';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { natsWrapper } from '../nats-wrapper';
import { firebase } from '../firebase';
import { ApiResponse } from '@unifycaredigital/aem';
import { PhoneNumberUtil } from 'google-libphonenumber';
const router = express.Router();

router.post(
  '/api/users/partnerotpsignup',
  [
    body('emailId').isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    let { userFirstName, userLastName, emailId, phoneNumber, emailOTP, phoneOTP } = req.body;

    if (!phoneNumber.includes('-') || !phoneNumber.includes('+')) {
      throw new BadRequestError('phoneNumber should contain country code');
    }

    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber);

    const isValidNumber = phoneUtil.isValidNumber(number);
    if (!isValidNumber) {
      throw new BadRequestError('phoneNumber is not valid');
    }


    const password = emailId;
    const id = mongoose.Types.ObjectId().toHexString();
    const partnerId = mongoose.Types.ObjectId().toHexString();
    const lastAuthAt = new Date();
    const userStatus = UserStatus.Unverified;
    const userType = UserType.PartnerSuperuser;

    const existingEmailId = await User.findOne({ emailId });
    if (existingEmailId) {
      throw new BadRequestError('Email in use');
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw new BadRequestError('Phone Number in use');
    }
    ////////Phone OTP Comparison/////////////
    const existingPhoneOTP = await PhoneOTP.findOne({ phoneNumber });

    if (!existingPhoneOTP) {
      throw new BadRequestError('Invalid credentials');
    }

    if (existingPhoneOTP.otpStatus === OTPStatus.Valid) {
      var pOTP: number = +phoneOTP;
      if (pOTP != existingPhoneOTP.otp) {
        console.log(`phoneOTP = ${pOTP} and existingPhoneOTP = ${existingPhoneOTP.otp}`);
        throw new BadRequestError(`Invalid phoneOTP ${pOTP} != ${existingPhoneOTP.otp}`);
      }
    } else {
      throw new BadRequestError('Phone OTP Expired');
    }

    existingPhoneOTP.set({
      otpStatus: OTPStatus.Used,
    });

    await existingPhoneOTP.save();

    ////////Email OTP Comparison/////////////
    const existingEmailOTP = await EmailOTP.findOne({ emailId });
    if (!existingEmailOTP) {
      throw new BadRequestError('Invalid credentials');
    }

    if (existingEmailOTP.otpStatus === OTPStatus.Valid) {
      var eOTP: number = +emailOTP;
      if (eOTP !== existingEmailOTP.otp) {
        throw new BadRequestError('Invalid Email OTP');
      }
    } else {
      throw new BadRequestError('Email OTP Expired');
    }

    existingEmailOTP.set({
      otpStatus: OTPStatus.Used,
    });

    await existingEmailOTP.save();
    ///////////////////////////////// 
    firebase
      .auth()
      .createUser({
        uid: id,
        email: emailId,
        phoneNumber: "+91" + phoneNumber,
        emailVerified: true,
        password: emailId,
        displayName: userFirstName + " " + userLastName,
        disabled: false,
      })
      .then((userRecord: any) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
      })
      .catch((error: any) => {
        console.log('Error creating new user:', error);
        throw new BadRequestError(" Unable to create user! Please contact at care@diahome.com")
      });

    ////////////////////////////////

    const user = User.build({
      userFirstName,
      userLastName,
      id,
      emailId,
      phoneNumber,
      password,
      userType,
      accessLevel: AccessLevel.PartnerSuperuser,
      partnerId,
      lastAuthAt,
      userStatus,
      registrationTimeAndDate: new Date(),
      pin: 'NA',
      employeeId: ''
    });
    await user.save();

    // Generate JWT which Expires In 1 hour
    const userJwt = jwt.sign(
      {
        id: user.id,
        emd: user.emailId,
        phn: user.phoneNumber,
        uty: user.userType,
        fid: user.partnerId,
        alv: user.accessLevel,
        ust: user.userStatus,
      },
      process.env.JWT_KEY!, { expiresIn: 60 * 60 }
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    //////// Publish New User Create Event
    new UserCreatedPublisher(natsWrapper.client).publish({
      id: user.id!,
      userFirstName: user.userFirstName,
      userLastName: user.userLastName,
      emailId: user.emailId,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      partnerId: user.partnerId,
      userStatus: user.userStatus,
      accessLevel: user.accessLevel,
      partnerType: PartnerType.MainBranch,
    });

    const newUser = {
      id: user.id,
      userFirstName: user.userFirstName,
      userLastName: user.userLastName,
      emailId: user.emailId,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      partnerId: user.partnerId,
      token: userJwt
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: newUser
    };
    res.status(201).send(apiResponse);

  });

export { router as partnerOtpSignupRouter };
