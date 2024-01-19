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

interface UserPayload {
  id: string,
}

router.post(
  '/api/users/resetpasswordwithkey',
  [
    body('password').trim()
      .notEmpty()
      .isLength({ min: 6, max: 50 })
      .withMessage('Password must be 6 character or more'),
    body('key').trim()
      .notEmpty()
      .withMessage('Please provide valid Key'),
  ],
  validateRequest,

  async (req: Request, res: Response) => {

    const { key, password } = req.body;

    let id = null;
    try {
      const payload = jwt.verify(
        key,
        process.env.JWT_KEY!
      ) as UserPayload;
      id = payload.id;
    } catch (err) {
      console.error(err);
      throw new BadRequestError('Invalid Credentials');
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      throw new BadRequestError('User not found');
    }

    existingUser.set({
      password: password,
      userStatus: UserStatus.Verified
    });
    await existingUser.save();

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: `Password Reset Successfully`
    };

    res.status(200).send(apiResponse);

    const userObj = {
      userFirstName: existingUser.userFirstName,
      userLastName: existingUser.userLastName,
      userEmailId: existingUser.emailId
    }

    var objJson = JSON.stringify(userObj);

    //////// Send Email to  New User 
    new SendNewEmailPublisher(natsWrapper.client).publish({
      to: existingUser.emailId,
      cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
      bcc: '',
      from: String(process.env.SYSTEM_SENDER_EMAIL_ID),
      subject: `${String(process.env.SYSTEM_SENDER_FULL_NAME)}:  Password Reset Successfully`,
      body: objJson,
      emailType: EmailType.HtmlText,
      emailTemplate: EmailTemplate.PasswordReset,
      emaiDeliveryType: EmailDeliveryType.Immediate,
      atExactTime: new Date()
    });

  });

export { router as employeeResetPasswordWithKeyRouter };

