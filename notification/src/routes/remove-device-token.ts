import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  ApiResponse
} from '@unifycaredigital/aem';
import { DeviceList } from '../models/device-list';
import { Device, DeviceDoc } from '../models/device';

const router = express.Router();

router.post(
  '/api/notification/token/remove',
  requireAuth,
  async (req: Request, res: Response) => {

    const userId = req.currentUser!.id;

    if (userId && userId !== "undefined") {

      let device = await Device.findOneAndDelete({ _id: userId });

      if (device) {
        console.log("Device Removed Successfully")
      } else {
        console.log("Token Not found for User: " + userId);
      }
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: "Device Removed Successfully"
    };

    res.status(200).send(apiResponse);
  }
);

export { router as removeDeviceTokenRouter };
