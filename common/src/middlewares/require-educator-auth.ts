import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { UserType } from '../types/user-type'
import { UserStatus } from '../types/user-status'

export const requireEducatorAuth = (
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
  if (req.currentUser.uty != UserType.Educator
    && req.currentUser.uty != UserType.PartnerEmployeeAdmin
    && req.currentUser.uty != UserType.PartnerSuperuser) {
    throw new NotAuthorizedError();
  }
  next();
};
