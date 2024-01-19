import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { UserStatus } from '../types/user-status'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  if (req.currentUser.ust === UserStatus.Suspended) {
    throw new NotAuthorizedError();
  }

  next();
};
