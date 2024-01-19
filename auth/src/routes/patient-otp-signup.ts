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
  ApiResponse
} from '@unifycaredigital/aem';

import mongoose from 'mongoose';
import { User } from '../models/user-auth';
import { PhoneOTP } from '../models/phone-otp';
import { EmailOTP } from '../models/email-otp';
import { PatientCreatedPublisher } from '../events/publishers/patient-created-publisher';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { natsWrapper } from '../nats-wrapper';
import { firebase } from '../firebase';
import { PhoneNumberUtil } from 'google-libphonenumber';

const router = express.Router();

router.post(
  '/api/users/patientotpsignup',
  [
    body('phoneNumber').trim().not().isEmpty().isLength({ min: 14 })
      .withMessage('phoneNumber is not valid'),
    body('emailId').isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    let {
      userFirstName,
      userLastName,
      emailId,
      phoneNumber,
      emailOTP,
      phoneOTP,
      age,
      gender,
      isMobileClient,
      languages,
      address,
      city,
      state,
      pin,
      country,
      userMotherName,
      ownerOrganisationUID
    } = req.body;

    console.log(req.body);

    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber);

    const isValidNumber = phoneUtil.isValidNumber(number);
    if (!isValidNumber) {
      throw new BadRequestError('phoneNumber is not valid');
    }

    const id = mongoose.Types.ObjectId().toHexString();
    const password = emailId;
    const patientPhoneNumber = phoneNumber.split("-");
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
    let rosterManager = await User.findOne({
      emailId: process.env.MASTER_ROSTER_EMAIL_ID,
      phoneNumber: process.env.MASTER_ROSTER_MOBILE_NUMBER
    });

    await firebase
      .auth()
      .createUser({
        uid: id,
        email: emailId,
        phoneNumber: patientPhoneNumber[0] + patientPhoneNumber[1],
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

    const user = User.build({
      userFirstName,
      userLastName,
      id,
      emailId,
      phoneNumber,
      password,
      userType: UserType.Patient,
      accessLevel: AccessLevel.Patient,
      partnerId: rosterManager ? rosterManager.partnerId : new mongoose.Types.ObjectId().toHexString(),
      lastAuthAt: new Date(),
      userStatus: UserStatus.Verified,
      registrationTimeAndDate: new Date(),
      pin: "NA",
      employeeId: "NA"
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
      process.env.JWT_KEY!, { expiresIn: 21 * 24 * 60 * 60 } //21 * 24 * 60 * 60 
    );

    if (!isMobileClient) {
      // Store it on session object
      req.session = {
        jwt: userJwt,
      };
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: user!
      };
      res.status(201).send(apiResponse);

    } else {
      const existingUser = {
        id: user.id,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        emailId: user.emailId,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        partnerId: user.partnerId,
        token: userJwt
      };
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: existingUser!
      };
      res.status(201).send(apiResponse);
    }

    //////// Publish New User Create Event
    new PatientCreatedPublisher(natsWrapper.client).publish({
      id: user.id!,
      userFirstName: user.userFirstName,
      userLastName: user.userLastName,
      emailId: user.emailId,
      phoneNumber: user.phoneNumber,
      partnerId: user.partnerId,
      dateOfBirth: age,
      gender: gender,
      languages: languages ? languages : ["Hindi"],
      address: address ? address : "NA",
      city: city ? city : "NA",
      state: state ? state : "NA",
      country: country ? country : "NA",
      pin: pin ? pin : "NA",
      userMotherName: userMotherName,
      patientPASID: "NA",
      patientUID: "NA",
      ownerOrganisationUID: ownerOrganisationUID,
      isVIP: false,
      statusFlag: "NA",
      registrationTimeAndDate: new Date(),
      nationality: 'NA',
      seqName: "NA"
    });

    //////// Send Email to  New User 
    new SendNewEmailPublisher(natsWrapper.client).publish({
      to: user.emailId,
      cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
      bcc: '',
      from: String(process.env.SYSTEM_SENDER_EMAIL_ID),
      subject: `Hello from ${String(process.env.SYSTEM_SENDER_FULL_NAME)}`,
      body: `<h1>Welcome from ${String(process.env.SYSTEM_SENDER_FULL_NAME)}</h1>`,
      emailType: EmailType.HtmlText,
      emailTemplate: EmailTemplate.NoTemplate,
      emaiDeliveryType: EmailDeliveryType.Immediate,
      atExactTime: new Date()
    });
  });

export { router as patientOTPSignupRouter };
