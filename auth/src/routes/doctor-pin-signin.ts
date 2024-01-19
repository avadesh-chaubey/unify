import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError, UserStatus, NotVerifiedError, UserType, ApiResponse } from '@unifycaredigital/aem';

import bcrypt from 'bcrypt';
import { User } from '../models/user-auth';

const router = express.Router();

router.post(
  '/api/users/doctorsignin',
  [
    body('employeeId').trim()
      .notEmpty()
      .withMessage('employeeId can not be empty'),
    body('pin').trim()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .withMessage('Pin must be 4 digit number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { employeeId, pin } = req.body;

    const existingUser = await User.findOne({ employeeId: employeeId, userType: UserType.Doctor });
    if (!existingUser) {
      console.log("employee not found: " + employeeId);
      throw new BadRequestError('Invalid credentials');
    }

    if (existingUser.userStatus === UserStatus.Unverified) {
      throw new NotVerifiedError();
    }

    if (existingUser.userType == UserType.Patient) {
      throw new BadRequestError('User already registered as Patient!!');
    }

    await bcrypt.compare(pin, existingUser.pin).then(function (result) {
      if (!result) {
        throw new BadRequestError('Invalid credentials');
      }
    });

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
        ust: existingUser.userStatus
      },
      process.env.JWT_KEY!, { expiresIn: 7 * 24 * 60 * 60 }
    );

    // Store it in session object.....
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
      employeeId: existingUser.employeeId,
      token: userJwt
    };

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: user
    };

    res.send(apiResponse);
  }
);

export { router as doctorSigninRouter };
