import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  ApiResponse
} from '@unifycaredigital/aem';
import { User } from '../models/user';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/notification/uid/update',
  requireAuth,
  [
    body('userId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('User Id must be provided'),
    body('uid')
      .not()
      .isEmpty()
      .withMessage('token must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { userId, uid } = req.body;

    let user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }
    //   user = User.build({
    //     id: userId,
    //     uid: uid,
    //   });
    //   await user.save();
    // } else {
    //   user.set({
    //     uid: uid,
    //   });
    //   await user.save();
    // }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: user
    };

    res.status(200).send(apiResponse);
  }
);

export { router as updateUserFirebaseIdRouter };
