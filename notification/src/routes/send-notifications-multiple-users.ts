import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  InternalServerError,
  DevicePushType,
  NotificationType,
  ApiResponse
} from '@unifycaredigital/aem';
import { Device } from '../models/device';
import { push } from '../push';
import { SendNotificationPublisher } from '../events/publishers/send-notification-publisher';
import { natsWrapper } from '../nats-wrapper';
//import { admin } from '../admin';
import { firebase } from '../firebase';

const router = express.Router();

router.post(
  '/api/notification/pushnotification',
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

    const { userId, title, body } = req.body;
    let device = await Device.findById(userId);
    if (!device) {
      console.error("device not found for : " + userId);
      return;
    }

    const sendFCM = await sendNotification(userId, title, body, req, res);

    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: 'Notification Sent'
    };
    res.send(apiResponse);
  }
);

async function sendNotification(userId: string, title: string, body: any, req: Request, res: Response) {

  let device = await Device.findById(userId);
  if (!device) {
    console.error("device not found for : " + userId);
    return;
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

    const iosData = {
      retries: 1,
      title: title,
      body: body,
      custom: body,
      topic: iosTopic,
      priority: 'high',
      sound: 'default',
      badge: 1,
      contentAvailable: 1,
    };
    console.log('iOS iosData: ' + JSON.stringify(iosData));

    const androidData = {

      data: {
        title: title,
        body: body,
        badge: '1'
      },

    };

    console.log('android androidData: ' + JSON.stringify(androidData));

    if (registrationIOSIds.length > 0) {
      const iosResult = await push.send(registrationIOSIds, iosData);
      console.log('iOS result: ' + JSON.stringify(iosResult));
    } else {
      console.log(`Send Notification registrationIOSIds.length = 0`);
    }

    if (registrationANDROIDIds.length > 0) {
      // const androidResult = await push.send(registrationANDROIDIds, androidData);
      // console.log('Android result: ' + JSON.stringify(androidResult));

      const options = {
        priority: "high"
      };

      const androidResult = await firebase.messaging().sendToDevice(registrationANDROIDIds[0], androidData, options);
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

  } catch (err) {
    console.error(err);
    throw new InternalServerError();
  }
}
export { router as sendPushNotificationRouter };
