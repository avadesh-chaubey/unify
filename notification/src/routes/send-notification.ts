import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  InternalServerError,
  DevicePushType,
  NotificationType,
  UserType,
  EmailType, EmailTemplate, EmailDeliveryType, BadRequestError,
  ApiResponse
} from '@unifycaredigital/aem';
import { Device } from '../models/device';
import { push } from '../push';
import { SendNotificationPublisher } from '../events/publishers/send-notification-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Appointment } from '../models/appointment';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';

const router = express.Router();

router.post(
  '/api/notification/push',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Message title must be provided'),
    body('body')
      .not()
      .isEmpty()
      .withMessage('Message body must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { userId, userId2, title, body, appointmentId } = req.body;

    let device = await Device.findById(userId);
    if (!device) {
      console.error("device not found for : " + userId);
      return;
    }

    const sendFCM = await sendNotification(userId, title, body, appointmentId, req, res);
    if (userId2 && userId2 != "" && userId2 != "NA") {
      const sendFCM2 = await sendNotification(userId2, title, body, appointmentId, req, res);
    }
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: 'OK'
    };

    res.status(200).send(apiResponse);
  }
);

async function sendNotification(userId: string, title: string, body: any, appointmentId: string, req: Request, res: Response) {

  let device = await Device.findById(userId);
  if (!device) {
    console.error("device not found for : " + userId);
    return;
  }

  let appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new BadRequestError("appointment not found for Id " + appointmentId)
  }

  try {
    console.log(`Send Notification 1`);
    const registrationIOSIds = [];
    const registrationANDROIDIds = [];
    const registrationChromeIds = [];
    let iosTopic;
    let androidTopic;
    const numberOfDevices = 1;
    for (let i = 0; i < numberOfDevices; i++) {
      if (device.deviceType === DevicePushType.APM) {
        if (device.token && device.token !== '') {
          registrationIOSIds.push(device.token);
          iosTopic = device.topic;
        }
      } else if (device.deviceType === DevicePushType.WEB) {
        if (device.token && device.token !== '') {
          registrationChromeIds.push(device.token);
        }
      } else {
        if (device.token && device.token !== '') {
          registrationANDROIDIds.push(device.token);
          androidTopic = device.topic;
        }
      }
    }

    //const iosData = {
    //     retries: 1,
    //     title: title,
    //     body: "Online Video Consultation",
    //     custom: newBody,
    //     topic: iosTopic,
    //     priority: 'high',
    //     sound: 'ringtone.caf',
    //     //pushType: 'voip',
    //     //alert: 'new pushkit',
    //     //expiry: Math.floor(Date.now() / 1000) + 6,
    //     //silent:"true",
    //     collapseKey:1,
    //     contentAvailable: 1,

    // };
    const iosData = {
      retries: 1,
      title: body.callerName,
      body: title,
      custom: body,
      topic: iosTopic,
      priority: 'high',
      sound: 'default',
      contentAvailable: 1,
    };
    console.log('iOS iosData: ' + JSON.stringify(iosData));

    const androidData = {
      title: title,
      body: "",
      alert: `New call from ${String(process.env.SYSTEM_SENDER_FULL_NAME)}`,
      priority: 'high',
      forground: true,
      silent: false,
      custom: body
    };


    if (registrationIOSIds.length > 0) {
      const iosResult = await push.send(registrationIOSIds, iosData);
      console.log('iOS result: ' + JSON.stringify(iosResult));
    } else {
      console.log(`Send Notification registrationIOSIds.length = 0`);
    }

    if (registrationANDROIDIds.length > 0) {
      const androidResult = await push.send(registrationANDROIDIds, androidData);
      console.log('Android result: ' + JSON.stringify(androidResult));
    }
    if (registrationChromeIds.length > 0) {

      new SendNotificationPublisher(natsWrapper.client).publish({
        to: registrationChromeIds as [string],
        title: title,
        body: body,
        type: NotificationType.Message,
        sendDateAndTime: new Date(),
        url: 'https://fcm.googleapis.com/fcm/send',
        key: `key=${process.env.GCM_API_KEY}`,
      });
    }

    // const makeInitialCapital = (str: any) => {
    //   let word = str.toLowerCase().split(" ");
    //   for (let i = 0; i < word.length; i++) {
    //     word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
    //   }
    //   return word.join(" ");
    // };

    // doctor and consultant.
    // if (req.currentUser?.uty == UserType.Patient) {
    //   const bodyforDoctor = { patientName: makeInitialCapital(appointment.parentName), doctorName: appointment.consultantName, title: title }
    //   const doctorobjJson = JSON.stringify(bodyforDoctor);
    //   new SendNewEmailPublisher(natsWrapper.client).publish({
    //     to: appointment.consultantEmailId,
    //     from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
    //     subject: `${String(process.env.SYSTEM_SENDER_FULL_NAME)} mentioned you in your chat`,
    //     body: doctorobjJson,
    //     emailType: EmailType.HtmlText,
    //     emailTemplate: EmailTemplate.MessageNotificationEmployee,
    //     emaiDeliveryType: EmailDeliveryType.Immediate,
    //     atExactTime: new Date()
    //   });
    //   const bodyforAssitant = { patientName: makeInitialCapital(appointment.parentName), doctorName: appointment.assistantName, title: title }
    //   const assitantobjJson = JSON.stringify(bodyforAssitant);
    //   new SendNewEmailPublisher(natsWrapper.client).publish({
    //     to: appointment.assistantEmailId,
    //     from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
    //     subject: `${String(process.env.SYSTEM_SENDER_FULL_NAME)} mentioned you in your chat`,
    //     body: assitantobjJson,
    //     emailType: EmailType.HtmlText,
    //     emailTemplate: EmailTemplate.MessageNotificationEmployee,
    //     emaiDeliveryType: EmailDeliveryType.Immediate,
    //     atExactTime: new Date()
    //   });
    // }
    // //send to patient
    // else {
    //   const bodyforpatinet = { patientName: makeInitialCapital(appointment.parentName), doctorName: appointment.consultantName, title: title }
    //   const patientobjJson = JSON.stringify(bodyforpatinet);
    //   new SendNewEmailPublisher(natsWrapper.client).publish({
    //     to: appointment.parentEmailId,
    //     from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
    //     subject: `${String(process.env.SYSTEM_SENDER_FULL_NAME)} mentioned you in your chat`,
    //     body: patientobjJson,
    //     emailType: EmailType.HtmlText,
    //     emailTemplate: EmailTemplate.MessageNotificationPatient,
    //     emaiDeliveryType: EmailDeliveryType.Immediate,
    //     atExactTime: new Date()
    //   });
    // }


  } catch (err) {
    console.error(err);
    throw new InternalServerError();
  }
}
export { router as sendNotificationRouter };
