import { requireAuth, UserType, ApiResponse } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';
import { UserAdmin } from '../models/user-admin';

const router = express.Router();
//We'll return all users except patient
router.get(
  '/api/users/getallusers',
  requireAuth,
  async (req: Request, res: Response) => {

    const users = await UserAdmin.find({ userType: { $ne: UserType.Patient } });
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: users
    };

    res.send(apiResponse);

  });

export { router as getallUser };
