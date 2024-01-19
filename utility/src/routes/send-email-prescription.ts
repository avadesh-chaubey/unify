import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { validateRequest } from "@unifycaredigital/aem";
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { natsWrapper } from '../nats-wrapper';
import { EmailType, EmailTemplate, EmailDeliveryType } from '@unifycaredigital/aem';

const router = express.Router();

router.post(
  "/api/utility/sendemailprescription",
  [
    body('emailId').isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { doctorName, doctordetails1, doctordetails2, hospitalName, hospitaladd1, hospitaladd2,
      mdrNo, datetime, consultType, patientId, patientAge, appointmentId, vitals, heigthInCms, weigthInKgs, bmi,
      bloodPressureDiastolic, bloodPressureSystolic, tempratureInFernite, chiefComplaints, diagnosis,
      medicinelist, adviceInstruction, testPrescription, nextVisit, date, emailId, body } = req.body;
    const prescriptionObj = {
      doctorName, doctordetails1, doctordetails2, hospitalName, hospitaladd1, hospitaladd2,
      mdrNo, datetime, consultType, patientId, patientAge, appointmentId, vitals, heigthInCms, weigthInKgs, bmi,
      bloodPressureDiastolic, bloodPressureSystolic, tempratureInFernite, chiefComplaints, diagnosis,
      medicinelist, adviceInstruction, testPrescription, nextVisit, date, body
    }
    var objJson = JSON.stringify(prescriptionObj);
    new SendNewEmailPublisher(natsWrapper.client).publish({
      to: emailId,
      cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
      bcc: "",
      from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
      subject: 'Prescription',
      body: objJson,
      emailType: EmailType.HtmlText,
      emailTemplate: EmailTemplate.TestPrescription,
      emaiDeliveryType: EmailDeliveryType.Immediate,
      atExactTime: new Date(),
    });
    res.sendStatus(200);
  }
);


export { router as sendEmailPrescriptionRouter };

