import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  DevicePushType,
  DeviceType,
  requireAuth,
  UserType,
  validateRequest,
  ApiResponse
} from '@unifycaredigital/aem';
import { DeviceList } from '../models/device-list';
import { Device, DeviceDoc } from '../models/device';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/notification/token/update',
  requireAuth,
  [
    body('uuid')
      .not()
      .isEmpty()
      .withMessage('uuid must be provided'),
    body('deviceType')
      .not()
      .isEmpty()
      .withMessage('Device Push Type must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { uuid, token, voiptoken, deviceType } = req.body;

    let topic = String(process.env.CUSTOMER_IOS_APP_ID);
    let devicePushType = DevicePushType.APM;

    if (req.currentUser!.uty === UserType.Patient) {
      if (deviceType === DeviceType.IOS) {
        topic = String(process.env.CUSTOMER_IOS_APP_ID);
        devicePushType = DevicePushType.APM;
      } else if (deviceType === DeviceType.Chrome) {
        topic = String(process.env.CONSULTANT_WEB_APP_ID);
        devicePushType = DevicePushType.WEB;
      } else {
        topic = String(process.env.CUSTOMER_ANDROID_APP_ID);
        devicePushType = DevicePushType.GCM;
      }
    } else {
      if (deviceType === DeviceType.IOS) {
        topic = String(process.env.CONSULTANT_IOS_APP_ID);
        devicePushType = DevicePushType.APM;
      } else if (deviceType === DeviceType.Chrome) {
        topic = String(process.env.CONSULTANT_WEB_APP_ID);
        devicePushType = DevicePushType.WEB;
      } else {
        topic = String(process.env.CONSULTANT_ANDROID_APP_ID);
        devicePushType = DevicePushType.GCM;
      }
    }

    let device = await Device.findById(req.currentUser!.id);
    console.log(`getting uuid = ` + uuid);
    console.log(`getting token = ` + token);
    console.log(`getting voiptoken = ` + voiptoken);
    console.log(`getting topic = ` + topic);
    if (!device) {
      const newDevice = Device.build({
        id: req.currentUser!.id,
        uuid: uuid,
        token: token,
        deviceType: devicePushType,
        topic: topic,
        voiptoken: voiptoken
      })
      await newDevice.save();
    } else {
      device.set({
        uuid: uuid,
        token: token,
        deviceType: devicePushType,
        topic: topic,
        voiptoken: voiptoken
      });
      await device.save();
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: device!
    };

    res.status(200).send(apiResponse);
  }
);

export { router as updateDeviceTokenRouter };
