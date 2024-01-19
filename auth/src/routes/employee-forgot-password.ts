import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user-auth';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { natsWrapper } from '../nats-wrapper';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '@unifycaredigital/aem';

import {
  validateRequest,
  BadRequestError,
  UserStatus,
  NotVerifiedError,
  EmailType,
  EmailTemplate,
  EmailDeliveryType
} from '@unifycaredigital/aem';

const router = express.Router();

router.post(
  '/api/users/forgotpassword',
  [
    body('emailId').isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { emailId } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    if (existingUser.userStatus === UserStatus.Unverified) {
      throw new NotVerifiedError();
    }

    //create token for email verification
    const resetPasswordKey = jwt.sign(
      {
        id: existingUser.id,
      },
      process.env.JWT_KEY!, { expiresIn: 2 * 60 * 60 }
    );

    const userObj = {
      userFirstName: existingUser.userFirstName,
      userLastName: existingUser.userLastName,
      userEmailId: existingUser.emailId,
      resetPasswordLink: `${String(process.env.DEPLOYMENT_URL)}/resetPassword/?key=${resetPasswordKey}`
    }

    var objJson = JSON.stringify(userObj);

    //////// Send Email to  New User 
    new SendNewEmailPublisher(natsWrapper.client).publish({
      to: existingUser.emailId,
      cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
      bcc: '',
      from: String(process.env.SYSTEM_SENDER_EMAIL_ID),
      subject: 'Reset Password Link',
      body: objJson,
      emailType: EmailType.HtmlText,
      emailTemplate: EmailTemplate.ForgotPassword,
      emaiDeliveryType: EmailDeliveryType.Immediate,
      atExactTime: new Date()
    });

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: `Password Reset Email sent successfully to ${existingUser.emailId}`
    };

    res.status(200).send(apiResponse);

  });

export { router as employeeForgotPasswordRouter };

