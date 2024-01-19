import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  UserStatus,
  EmailType,
  EmailTemplate,
  EmailDeliveryType,
  NotAuthorizedError,
  ApiResponse
} from '@unifycaredigital/aem';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { natsWrapper } from '../nats-wrapper';

import { User } from '../models/user-auth';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/sendverificationemail',
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

    if (existingUser.userStatus === UserStatus.Suspended) {
      throw new NotAuthorizedError();
    }

    existingUser.set({
      userStatus: UserStatus.Unverified,
    });


    // Store it on session object
    req.session = {
      jwt: existingUser,
    };

    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: existingUser
    };

    res.status(201).send(apiResponse);

    //create token for email verification
    const verificationKey = jwt.sign(
      {
        id: existingUser.id,
      },
      process.env.JWT_KEY!, { expiresIn: 7 * 24 * 60 * 60 }
    );

    const emailObj = {
      userFirstName: existingUser.userFirstName,
      userLastName: existingUser.userLastName,
      verificationUrl: `${String(process.env.DEPLOYMENT_URL)}/email-verify/${verificationKey}`
    }



    var objJson = JSON.stringify(emailObj);

    //////// Send Email to  New User 
    new SendNewEmailPublisher(natsWrapper.client).publish({
      to: existingUser.emailId,
      cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
      bcc: '',
      from: String(process.env.SYSTEM_SENDER_EMAIL_ID),
      subject: `${String(process.env.SYSTEM_SENDER_FULL_NAME)} verification`,
      body: objJson,
      emailType: EmailType.HtmlText,
      emailTemplate: EmailTemplate.VerifyEmail,
      emaiDeliveryType: EmailDeliveryType.Immediate,
      atExactTime: new Date()
    });

    apiResponse = {
      status: 200,
      message: 'Success',
      data: { message: 'Verification Email Sent Successfully' }
    };

    res.status(200).send(apiResponse);
  }
);

export { router as sendVerificationEmailRouter };
