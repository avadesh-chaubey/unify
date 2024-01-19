import express, { Request, Response } from 'express';
import { NotAuthorizedError, BadRequestError, UserStatus } from '@unifycaredigital/aem';
import jwt from 'jsonwebtoken';

import { User } from '../models/user-auth';

const router = express.Router();

interface UserPayload {
  id: string,
}

router.get(
  '/api/users/emailverification/:id',
  async (req: Request, res: Response) => {
    const jwtKey = req.params.id;
    let id = null;

    try {
      const payload = jwt.verify(
        jwtKey,
        process.env.JWT_KEY!
      ) as UserPayload;
      id = payload.id;
    } catch (err) {
      console.error(err);
      throw new BadRequestError('Invalid Credentials');
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    if (existingUser.userStatus === UserStatus.Suspended) {
      throw new NotAuthorizedError();
    }

    if (existingUser.userStatus === UserStatus.Verified) {
      throw new BadRequestError('Verification Link Expired');
    }

    existingUser.set({
      userStatus: UserStatus.Verified,
    });
    await existingUser.save();

    res.redirect('https://34.68.126.48/emailVerifiedSuccess', 200);
  }
);

export { router as employeeEmailVerificationRouter };
