import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import {
  validateRequest,
  BadRequestError,
  UserStatus,
  AccessLevel,
  UserType,
  PartnerType,
  ApiResponse
} from '@unifycaredigital/aem';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

import mongoose from 'mongoose';
import { User } from '../models/user-auth';
import { firebase } from '../firebase';

const router = express.Router();


router.post(
  '/api/users/partnersignup',
  [
    body('emailId').isEmail().withMessage('Email must be valid'),
    body('password').trim()
      .notEmpty()
      .isLength({ min: 6, max: 50 })
      .withMessage('Password must be 6 character or more'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      userFirstName,
      userLastName,
      emailId,
      phoneNumber,
      password,
    } = req.body;

    const id = mongoose.Types.ObjectId().toHexString();
    const partnerId = mongoose.Types.ObjectId().toHexString();
    const lastAuthAt = new Date();
    const userStatus = UserStatus.Unverified;
    const userType = UserType.PartnerSuperuser;

    const existingEmailId = await User.findOne({ emailId });

    if (existingEmailId) {
      throw new BadRequestError('Email in use');
    }

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
        console.log('Successfully created new user--:', userRecord.uid);
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
      password,
      userType,
      partnerId,
      accessLevel: AccessLevel.PartnerSuperuser,
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

export { router as partnerSignupRouter };
