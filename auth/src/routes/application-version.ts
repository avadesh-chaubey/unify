import express, { Request, Response } from 'express';
import { NotAuthorizedError, BadRequestError, UserStatus, ApiResponse } from '@unifycaredigital/aem';
import jwt from 'jsonwebtoken';

import { User } from '../models/user-auth';

const router = express.Router();

interface UserPayload {
  id: string,
}

router.get(
  '/api/users/application/version',
  async (req: Request, res: Response) => {
    const applicationConfig = {
      iosPatientAppVersion: String(process.env.PATIENT_IOS_APP_VERSION),
      androidPatientAppVersion: String(process.env.PATIENT_ANDROID_APP_VERSION),
      iosPatientAppForcedUpdate: String(process.env.PATIENT_IOS_APP_FORCED_UPDATE),
      androidPatientAppForcedUpdate: String(process.env.PATIENT_ANDROID_APP_FORCED_UPDATE),
    };

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: applicationConfig
    };

    res.status(200).send(apiResponse);
  }
);

export { router as applicationVersionRouter };
