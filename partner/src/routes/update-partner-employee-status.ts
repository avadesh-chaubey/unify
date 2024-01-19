import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireRosterManagerAuth, validateRequest, NotFoundError, UserStatus, SMSTemplate, SMSType, EmailType, EmailTemplate, EmailDeliveryType, UserType, AppointmentStatus, ApiResponse } from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';
import { PartnerEmployeeStatusChangedPublisher } from '../events/publishers/partner-employee-status-changed-publisher';
import { natsWrapper } from '../nats-wrapper';
import { SendNewSMSPublisher } from '../events/publishers/send-new-sms-publisher';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { Appointment } from '../models/appointment';


const router = express.Router();

router.put(
  '/api/partner/employeestatus',
  requireRosterManagerAuth,
  [
    body('userStatus').not().isEmpty().withMessage('User Status is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { id, userStatus } = req.body;

    const partnerSubuser = await PartnerEmployee.findById(id);

    if (!partnerSubuser) {
      throw new NotFoundError();
    }

    if (partnerSubuser.userType === UserType.Doctor
      || partnerSubuser.userType === UserType.Dietician
      || partnerSubuser.userType === UserType.Educator
      && partnerSubuser.userStatus !== UserStatus.Suspended
      && userStatus === UserStatus.Suspended) {
      const appointmentList = await Appointment.find({
        consultantId: id,
        appointmentStatus: { $in: [AppointmentStatus.CaseHistoryPending, AppointmentStatus.ReadyForDoctorConsultation] }
      })
      if (appointmentList && appointmentList.length > 0) {
        const apiResponse: ApiResponse = {
          status: 200,
          message: 'Success',
          data: appointmentList
        }
        res.send(apiResponse);
        return;
      }
    } else if (partnerSubuser.userType === UserType.PhysicianAssistant
      && partnerSubuser.userStatus !== UserStatus.Suspended
      && userStatus === UserStatus.Suspended) {
      const appointmentList = await Appointment.find({
        assistantId: id,
        appointmentStatus: { $in: [AppointmentStatus.CaseHistoryPending, AppointmentStatus.ReadyForDoctorConsultation] }
      })
      if (appointmentList && appointmentList.length > 0) {
        const apiResponse: ApiResponse = {
          status: 200,
          message: 'Success',
          data: appointmentList
        }
        res.send(apiResponse);
        return;
      }
    }

    partnerSubuser.set({
      userStatus: userStatus,
    });

    await partnerSubuser.save();

    new PartnerEmployeeStatusChangedPublisher(natsWrapper.client).publish({
      id: partnerSubuser.id!,
      userStatus: partnerSubuser.userStatus,
    });
    if (userStatus === UserStatus.Suspended) {
      //////// Send SMS to  New User
      const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
        "&To=" + partnerSubuser.phoneNumber +
        "&TemplateName=" + SMSTemplate.ACCOUNT_SUSPEND +
        "&VAR1=" + partnerSubuser.userFirstName;

      new SendNewSMSPublisher(natsWrapper.client).publish({
        to: partnerSubuser.phoneNumber,
        body: smsBody,
        smsType: SMSType.Transactional,
        smsTemplate: SMSTemplate.ACCOUNT_SUSPEND,
        generatedAt: new Date(),
      });

      const emailBody = { doctorName: partnerSubuser.userFirstName }
      const objJson = JSON.stringify(emailBody);
      new SendNewEmailPublisher(natsWrapper.client).publish({
        to: partnerSubuser.emailId,
        cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
        bcc: '',
        from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
        subject: 'Account Suspended',
        body: objJson,
        emailType: EmailType.HtmlText,
        emailTemplate: EmailTemplate.AccountSuspended,
        emaiDeliveryType: EmailDeliveryType.Immediate,
        atExactTime: new Date()
      });
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: partnerSubuser
    };

    res.send(apiResponse);
  }
);

export { router as updatePartnerSubuserStatusRouter };
