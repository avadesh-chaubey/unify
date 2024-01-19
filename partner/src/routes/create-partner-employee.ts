import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  UserStatus,
  AccessLevel,
  EmailType,
  EmailTemplate,
  EmailDeliveryType,
  UserType,
  SMSType,
  SMSTemplate,
  requireRosterManagerAuth,
  BadRequestError,
  LocationBasedFeeConfig,
  ApiResponse
} from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';
import { PartnerEmployeeCreatedPublisher } from '../events/publishers/partner-employee-created-publisher';
import { ConsultantCreatedPublisher } from '../events/publishers/consultant-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import mongoose from 'mongoose';

import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import jwt from 'jsonwebtoken';
import { SendNewSMSPublisher } from '../events/publishers/send-new-sms-publisher';
import { firebase } from '../firebase';
import { User } from '../models/user';
import moment from 'moment';

const router = express.Router();

router.post(
  '/api/partner/employee',
  requireRosterManagerAuth,
  [
    body('userFirstName').not().isEmpty().withMessage('User First Name is required'),
    body("userLastName").not().isEmpty().withMessage("User Last Name is required"),
    body('userType').not().isEmpty().withMessage('UserType is required'),
    body('emailId').isEmail().withMessage('Email must be valid'),
    body("dateOfBirth").not().isEmpty().withMessage("dateOfBirth is required"),
    body("gender").not().isEmpty().withMessage("Gender is required"),
    body("profileImageName").not().isEmpty().withMessage("profileImageName is required"),
    body('phoneNumber').trim().isLength({ min: 10, max: 10 }).withMessage('Phone Number must be 10 Digit'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    let {
      title,
      userFirstName,
      userMiddleName,
      userLastName,
      emailId,
      phoneNumber,
      userType,
      genderType,
      languages,
      dateOfBirth,
      experinceInYears,
      qualificationList,
      department,
      specialization,
      profileImageName,
      designation,
      panNumber,
      panUrl,
      address,
      city,
      state,
      country,
      pin,
      addressProofNumber,
      addressProofUrl,
      consultationChargesInINR,
      doctorRegistrationNumber,
      avaiability,
      activeFrom,
      activeTill,
      employeeId,
      uniqueId,
      organization,
      superSpeciality,
      userId,
      password,
      about,
      isConsultant,
      feeDetails,
      organizationUID,
      specialityUID
    } = req.body;

    const id = new mongoose.Types.ObjectId().toHexString();

    // const existingUser = await PartnerEmployee.findOne({ uniqueId: uniqueId });

    // if (existingUser) {
    //   throw new BadRequestError("User already registered with uniqueId: " + uniqueId);
    // }

    //getting dob in YYYY-MM-DD format
    if (!moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()) {
      throw new BadRequestError("DOB Format should be YYYY-MM-DD");
    }
    //Make sure only same day or past dateOfBirth consider as valid.
    if (!moment(dateOfBirth).isSameOrBefore(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      throw new BadRequestError("DOB Cannot be of future date");
    }

    if (activeFrom && activeTill) {
      // check activeFrom date is formed as required
      if (!moment(activeFrom, 'YYYY-MM-DD', true).isValid()) {
        throw new BadRequestError("Date Format should be YYYY-MM-DD");
      }
      // check activeTill date formed as required
      if (!moment(activeTill, 'YYYY-MM-DD', true).isValid()) {
        throw new BadRequestError("Date Format should be YYYY-MM-DD");
      }
      //Make sure only activeTill must be earlier than activeFrom
      if (!moment(activeTill).isSameOrAfter(moment(activeFrom))) {
        throw new BadRequestError("activeFrom must be date before activeTill");
      }
    }


    // let isConsultant = true;
    // if (userType === UserType.PartnerRosterManager
    //   || userType === UserType.PhysicianAssistant) {
    //   isConsultant = false;
    //   consultationChargesInINR = 0;
    // } else if (!consultationChargesInINR) {
    //   consultationChargesInINR = 500;
    // }

    if (isConsultant && userType === UserType.Doctor) {

      const existingUser = await PartnerEmployee.findOne({ uniqueId: uniqueId });
      if (existingUser) {
        throw new BadRequestError("User already registered with uniqueId: " + uniqueId);
      }

      if (userId && password && uniqueId && organization && specialization && superSpeciality
        && organization && doctorRegistrationNumber &&
        designation && employeeId && feeDetails) {
        consultationChargesInINR = consultationChargesInINR;
        avaiability = avaiability,
          activeFrom = activeFrom,
          activeTill = activeTill,
          employeeId = employeeId,
          uniqueId = uniqueId,
          organization = organization,
          specialization = specialization,
          superSpeciality = superSpeciality;
        feeDetails = feeDetails
        doctorRegistrationNumber = doctorRegistrationNumber
      } else {
        throw new BadRequestError("userId, password, uniqueId, organization, specilization, superSpeciality, organization, license number, designation, employeeId & feeDetails are mandatory fields");
      }
    }

    let existingEmailId = await PartnerEmployee.findOne({ emailId: emailId });
    if (existingEmailId) {
      throw new BadRequestError('Email in use');
    }

    let existingPhoneNumber = await PartnerEmployee.findOne({ phoneNumber: phoneNumber });
    if (existingPhoneNumber) {
      throw new BadRequestError('Phone Number in use');
    }

    const existingEmail = await User.findOne({ emailId: emailId });
    if (existingEmail) {
      throw new BadRequestError('Email in use');
    }

    const existingPhone = await User.findOne({ phoneNumber: phoneNumber });
    if (existingPhone) {
      throw new BadRequestError('Phone Number in use');
    }

    const locationBasedFeeConfig: [LocationBasedFeeConfig] = [
      {
        country: 'ANY',
        state: 'ANY',
        city: 'ANY',
        locationConfig: 'ANY#ANY#ANY',
        flatFees: consultationChargesInINR,
        feeInPercentage: 100,
        followUpFees: 0,
        appointmentType: 'ANY#ANY#ANY'
      }
    ];
    const employee = PartnerEmployee.build({
      id,
      title,
      //userFirstName: title + " " + userFirstName,
      userFirstName,
      userMiddleName,
      userLastName,
      emailId,
      phoneNumber: '+91-' + phoneNumber,
      partnerId: req.currentUser!.fid,
      userStatus: UserStatus.Verified,
      accessLevel: AccessLevel.Employee,
      genderType: genderType,
      userType: userType,
      dateOfBirth: dateOfBirth,
      experinceInYears: experinceInYears,
      qualificationList: qualificationList,
      department: department,
      specialization: specialization,
      profileImageName: profileImageName,
      designation: designation,
      onboardingDate: new Date(),
      languages: languages,
      panNumber: panNumber,
      panUrl: panUrl,
      address: address,
      city: city,
      state: state,
      country: country,
      pin: pin,
      addressProofNumber: addressProofNumber,
      addressProofUrl: addressProofUrl,
      consultationChargesInINR: consultationChargesInINR,
      isConsultant: isConsultant,
      doctorRegistrationNumber: String(doctorRegistrationNumber),
      locationBasedFeeConfig: locationBasedFeeConfig,
      avaiability: avaiability,
      activeFrom: activeFrom,
      activeTill: activeTill,
      employeeId: employeeId,
      uniqueId: uniqueId,
      organization: organization,
      superSpeciality: superSpeciality,
      userId: userId,
      password: password,
      about: about,
      feeDetails: feeDetails,
      organizationUID: organizationUID,
      specialityUID: specialityUID
    });
    await employee.save();

    await firebase
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
        throw new BadRequestError(`Unable to create user! ${error}`);
      });


    new PartnerEmployeeCreatedPublisher(natsWrapper.client).publish({
      id: employee.id!,
      userFirstName: employee.userFirstName,
      userLastName: employee.userLastName,
      emailId: employee.emailId,
      phoneNumber: '+91-' + phoneNumber,
      partnerId: employee.partnerId,
      userStatus: employee.userStatus,
      accessLevel: employee.accessLevel,
      userType: employee.userType,
      dateOfBirth: employee.dateOfBirth,
      experinceInYears: employee.experinceInYears,
      qualificationList: employee.qualificationList,
      department: employee.department,
      specialization: employee.specialization,
      profileImageName: employee.profileImageName,
      designation: employee.designation,
      city: employee.city,
      state: employee.state,
      country: employee.country,
      pin: employee.pin,
      languages: employee.languages,
      doctorRegistrationNumber: employee.doctorRegistrationNumber,
      employeeId: employee.uniqueId,
      organization: employee.organization,
      organizationUID: employee.organizationUID,
      specialityUID: employee.specialityUID
    });

    //TODO Merge both messages in One
    if (userType !== UserType.PartnerRosterManager) {
      new ConsultantCreatedPublisher(natsWrapper.client).publish({
        id: employee.id!,
        userFirstName: employee.userFirstName,
        userMiddleName: employee.userMiddleName,
        userLastName: employee.userLastName,
        emailId: employee.emailId,
        phoneNumber: '+91-' + phoneNumber,
        partnerId: employee.partnerId,
        userStatus: employee.userStatus,
        userType: employee.userType,
        dateOfBirth: employee.dateOfBirth,
        experinceInYears: employee.experinceInYears,
        qualificationList: employee.qualificationList,
        department: employee.department,
        specialization: employee.specialization,
        profileImageName: employee.profileImageName,
        designation: employee.designation,
        city: employee.city,
        state: employee.state,
        country: employee.country,
        pin: employee.pin,
        languages: employee.languages,
        consultationChargesInINR: consultationChargesInINR,
        genderType: genderType,
        doctorRegistrationNumber: employee.doctorRegistrationNumber,
        locationBasedFeeConfig: employee.locationBasedFeeConfig,
        about: employee.about
      });
    }

    //create token for email verification
    const inviteKey = jwt.sign(
      {
        id: employee.id,
      },
      process.env.JWT_KEY!, { expiresIn: 2 * 24 * 60 * 60 }
    );
    let docotrType = "Doctor";
    if (employee?.userType == UserType.Dietician) {
      docotrType = "Dietitian";
    } else if (employee?.userType == UserType.Educator) {
      docotrType = "Diabetes Educator";
    } else if (employee?.userType == UserType.Nutritionist) {
      docotrType = "Nutritionist";
    } else if (employee?.userType == UserType.PartnerRosterManager) {
      docotrType = "Roaster Manager";
    } else if (employee?.userType == UserType.Diabetologist) {
      docotrType = "Diabetologist";
    } else if (employee?.userType == UserType.PhysicianAssistant) {
      docotrType = "Physician Assistant";
    }

    const userObj = {
      userFirstName: employee.title + " " + employee.userFirstName,
      userLastName: employee.userLastName,
      userEmailId: employee.emailId,
      inviteLink: `${String(process.env.DEPLOYMENT_URL)}/invite-employee/${inviteKey}`
    }

    const makeInitialCapital = (str: any) => {
      let word = str.toLowerCase().split(" ");
      for (let i = 0; i < word.length; i++) {
        word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
      }
      return word.join(" ");
    };

    const emailBody = { userFirstName: makeInitialCapital(employee.userFirstName), userLastName: makeInitialCapital(employee.userLastName), userName: emailId, password: password, userType: docotrType }

    const objJson = JSON.stringify(emailBody);

    //////// Send Email to  New User
    new SendNewEmailPublisher(natsWrapper.client).publish({
      to: emailId,
      cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
      bcc: '',
      from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
      subject: 'Your Registration Details',
      body: objJson,
      emailType: EmailType.HtmlText,
      emailTemplate: EmailTemplate.RegistrationDetails,
      emaiDeliveryType: EmailDeliveryType.Immediate,
      atExactTime: new Date()
    });

    //////// Send SMS to  New User
    const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
      "&To=" + phoneNumber +
      "&TemplateName=" + SMSTemplate.WELCOME_MSG1 +
      "&VAR1=" + `Team ${String(process.env.SYSTEM_SENDER_FULL_NAME)}`;

    new SendNewSMSPublisher(natsWrapper.client).publish({
      to: '91' + phoneNumber,
      body: smsBody,
      smsType: SMSType.Transactional,
      smsTemplate: SMSTemplate.WELCOME_MSG1,
      generatedAt: new Date(),
    });

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: employee
    };

    res.send(apiResponse);
  }
);

export { router as createPartnerEmployeeRouter };
