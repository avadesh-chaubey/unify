import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AccessLevel } from '../types/access-level'
import { UserStatus } from '../types/user-status'

interface UserPayload {
  id: string,
  emd: string,
  phn: string,
  uty: string,
  fid: string,
  alv: AccessLevel,
  ust: UserStatus,
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    if (!req.headers || !req.headers?.authtoken) {
      return next();
    }
  }

  try {
    let token = req.session?.jwt
    if (!token) {
      token = req.headers?.authtoken
    }
    const payload = jwt.verify(
      token,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) { }

  next();
};
