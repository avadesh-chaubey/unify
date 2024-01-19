import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  ApiResponse
} from '@unifycaredigital/aem';
import { User } from '../models/user';

const router = express.Router();

router.get(
  '/api/notification/uid/show/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (id && id !== "undefined") {
      let user = await User.findById(req.params.id);
      if (!user) {
        throw new NotFoundError();
      }

      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: user
      };

      res.status(200).send(apiResponse);
    } else {
      throw new NotFoundError();
    }
  }
);

export { router as showUserFirebaseIdRouter };
