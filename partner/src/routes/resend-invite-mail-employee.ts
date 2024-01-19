import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireRosterManagerAuth,
  EmailType,
  EmailTemplate,
  EmailDeliveryType,
  NotFoundError,
  validateRequest
} from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';
import { natsWrapper } from '../nats-wrapper';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/partner/resendinvite',
  requireRosterManagerAuth,
  [
    body('employeeId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Employee Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const employee = await PartnerEmployee.findById(req.body.employeeId);

    if (!employee) {
      throw new NotFoundError();
    }

    //create token for email verification
    const inviteKey = jwt.sign(
      {
        id: employee.id,
      },
      process.env.JWT_KEY!, { expiresIn: 2 * 24 * 60 * 60 }
    );

    const userObj = {
      userFirstName: employee.userFirstName,
      userLastName: employee.userLastName,
      userEmailId: employee.emailId,
      inviteLink: `${String(process.env.DEPLOYMENT_URL)}/invite-employee/${inviteKey}`
    }

    var objJson = JSON.stringify(userObj);

    //////// Send Email to  New User 
    new SendNewEmailPublisher(natsWrapper.client).publish({
      to: employee.emailId,
      cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
      bcc: '',
      from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
      subject: 'Invited To Join Unify Care',
      body: objJson,
      emailType: EmailType.HtmlText,
      emailTemplate: EmailTemplate.ForgotPassword,
      emaiDeliveryType: EmailDeliveryType.Immediate,
      atExactTime: new Date()
    });
    const apiResponse = {
      status: 200,
      message: 'Success',
      data: "Invite Email Sent Successfully"
    };
    res.send(apiResponse);
  }
);

export { router as resendInviteEmployeeRouter };
