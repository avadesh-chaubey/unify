import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import {
  validateRequest,
  BadRequestError,
  UserStatus,
  AccessLevel,
  UserType,
  EmailType,
  EmailTemplate,
  EmailDeliveryType,
  PartnerType,
  SMSType,
  SMSTemplate,
  ApiResponse
} from '@unifycaredigital/aem';
import { PatientCreatedPublisher } from '../events/publishers/patient-created-publisher';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';
import { User } from '../models/user-auth';
import { PhoneOTP } from '../models/phone-otp';
import { SendNewSMSPublisher } from '../events/publishers/send-new-sms-publisher';
import { firebase } from '../firebase';
import { PhoneNumberUtil } from 'google-libphonenumber';


const router = express.Router();


router.post(
  '/api/users/patientsignup',
  [
    body('phoneNumber').trim().not().isEmpty().isLength({ min: 14 })
      .withMessage('phoneNumber is not valid'),
    body('emailId').isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      userFirstName,
      userLastName,
      emailId,
      phoneNumber,
      age,
      gender,
      token,
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

    const id = mongoose.Types.ObjectId().toHexString();
    const lastAuthAt = new Date();
    const userStatus = UserStatus.Verified;
    const userType = UserType.Patient;
    const patientPhoneNumber = phoneNumber.split("-");

    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber);

    const isValidNumber = phoneUtil.isValidNumber(number);
    if (!isValidNumber) {
      throw new BadRequestError('phoneNumber is not valid');
    }


    const existingEmailId = await User.findOne({ emailId });

    if (existingEmailId) {
      throw new BadRequestError('Email in use');
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw new BadRequestError('Phone Number in use');
    }

    const phoneOTP = await PhoneOTP.findOne({ phoneNumber });
    if (!phoneOTP) {
      throw new BadRequestError('Invalid credentials');
    }

    if (phoneOTP.token !== token) {
      throw new BadRequestError('Invalid Token');
    }
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
      id,
      userFirstName,
      userLastName,
      emailId,
      phoneNumber,
      password: emailId,
      userType,
      partnerId: rosterManager ? rosterManager.partnerId : new mongoose.Types.ObjectId().toHexString(),
      accessLevel: AccessLevel.Patient,
      lastAuthAt,
      userStatus,
      registrationTimeAndDate: new Date(),
      pin: "NA",
      employeeId: "NAs"
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
      pin: pin ? pin : "NA",
      country: country ? country : "NA",
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
    const makeInitialCapital = (str: any) => {
      let word = str.toLowerCase().split(" ");
      for (let i = 0; i < word.length; i++) {
        word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
      }
      return word.join(" ");
    };

    //////// Send Email to  New User 
    const emailBodytopatient = {
      userFirstName: makeInitialCapital(user.userFirstName),
      userLastName: makeInitialCapital(user.userLastName),
      useremail: user.emailId, password: user.password,
      userPhoneNumber: user.phoneNumber
    }
    const objJson = JSON.stringify(emailBodytopatient);
    new SendNewEmailPublisher(natsWrapper.client).publish({
      to: user.emailId,
      cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
      bcc: '',
      from: String(process.env.SYSTEM_SENDER_EMAIL_ID),
      subject: 'Your Registration is Successful',
      body: objJson,
      emailType: EmailType.HtmlText,
      emailTemplate: EmailTemplate.RegistrationSuccessful,
      emaiDeliveryType: EmailDeliveryType.Immediate,
      atExactTime: new Date()
    });

    //////// Send SMS to  New User 
    const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
      "&To=" + phoneNumber +
      "&TemplateName=" + SMSTemplate.PATIENT_REGITRATION +
      "&VAR1=" + "Dear " + userFirstName;

    new SendNewSMSPublisher(natsWrapper.client).publish({
      to: phoneNumber,
      body: smsBody,
      smsType: SMSType.Transactional,
      smsTemplate: SMSTemplate.PATIENT_REGITRATION,
      generatedAt: new Date(),
    });
  });

export { router as patientSignupRouter };
