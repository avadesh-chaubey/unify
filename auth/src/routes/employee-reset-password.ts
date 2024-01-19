import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user-auth';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { natsWrapper } from '../nats-wrapper';
import bcrypt from 'bcrypt';

import {
  validateRequest,
  BadRequestError,
  EmailType,
  EmailTemplate,
  EmailDeliveryType,
  requireEmployeeAuth,
  ApiResponse
} from '@unifycaredigital/aem';

const router = express.Router();

router.post(
  '/api/users/resetpassword',
  requireEmployeeAuth,
  [
    body('oldpassword').trim()
      .notEmpty()
      .isLength({ min: 6, max: 50 })
      .withMessage('Old Password must be 6 character or more'),
    body('newpassword').trim()
      .notEmpty()
      .isLength({ min: 6, max: 50 })
      .withMessage('New Password must be 6 character or more'),
  ],
  validateRequest,

  async (req: Request, res: Response) => {

    const { oldpassword, newpassword } = req.body;

    const existingUser = await User.findById(req.currentUser!.id);
    if (!existingUser) {
      throw new BadRequestError('User not found');
    }

    await bcrypt.compare(oldpassword, existingUser.password).then(function (result) {
      if (!result) {
        throw new BadRequestError('Invalid credentials');
      }
    });

    existingUser.set({
      password: newpassword,
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
      subject: `${String(process.env.SYSTEM_SENDER_FULL_NAME)}: Password Reset Successfully`,
      body: objJson,
      emailType: EmailType.HtmlText,
      emailTemplate: EmailTemplate.PasswordReset,
      emaiDeliveryType: EmailDeliveryType.Immediate,
      atExactTime: new Date()
    });
  });

export { router as employeeResetPasswordRouter };

