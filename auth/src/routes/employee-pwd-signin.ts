import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError, UserStatus, NotVerifiedError, UserType, ApiResponse } from '@unifycaredigital/aem';

import bcrypt from 'bcrypt';
import { User } from '../models/user-auth';
import { UserAdmin } from '../models/user-admin';
import { RolesAndPermissions } from '../models/assign-permissions';
import { AccessControl } from '../models/access-control';

const router = express.Router();

router.post(
  '/api/users/employeesignin',
  [
    body('emailId').isEmail().withMessage('Email must be valid'),
    body('password').trim()
      .notEmpty()
      .isLength({ min: 6, max: 50 })
      .withMessage('Password must be 6 character or more'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { emailId, password } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (!existingUser) {
      console.log("email not found: " + emailId);
      throw new BadRequestError('Invalid credentials');
    }

    if (existingUser.userStatus === UserStatus.Unverified) {
      throw new NotVerifiedError();
    }


    if (existingUser.userType == UserType.Patient) {
      throw new BadRequestError('User already registered as Patient!!');
    }

    await bcrypt.compare(password, existingUser.password).then(function (result) {
      if (!result) {
        throw new BadRequestError('Invalid credentials');
      }
    });

    existingUser.set({
      lastAuthAt: new Date(),
    });
    await existingUser.save();

	const existingAdminUser = await UserAdmin.findOne({ emailId });
    const rolePermission = await RolesAndPermissions.findOne({ role: existingAdminUser?.role }).lean();
	const accessControl = await AccessControl.find();

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
		role: existingAdminUser?.role,
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
	  role: existingAdminUser?.role,
	  rolePermission,
      accessControl,
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

export { router as employeeSigninRouter };
