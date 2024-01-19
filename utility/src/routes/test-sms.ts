import express, { Request, Response } from "express";
import { ChiefComplaint } from "../model/chief-complaint";
import { SendNewSMSPublisher } from "../events/publishers/send-new-sms-publisher";
import { natsWrapper } from '../nats-wrapper';
import {

  SMSType,
  SMSTemplate,
} from '@unifycaredigital/aem';

const router = express.Router();

router.get(
  "/api/utility/testsms",
  async (req: Request, res: Response) => {
    //////// Send SMS to  New User 
    const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
      "&To=" + "8447745772" +
      "&TemplateName=" + SMSTemplate.WELCOME_MSG1 +
      "&VAR1=" + `Team ${String(process.env.SYSTEM_SENDER_FULL_NAME)}`;

    new SendNewSMSPublisher(natsWrapper.client).publish({
      to: "8447745772",
      body: smsBody,
      smsType: SMSType.Transactional,
      smsTemplate: SMSTemplate.WELCOME_MSG1,
      generatedAt: new Date(),
    });
  }
);

export { router as smsTestRouter };
