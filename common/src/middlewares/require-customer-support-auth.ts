import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { UserType } from '../types/user-type'
import { UserStatus } from '../types/user-status'

export const requireCustomerSupportAuth = (
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
  if (req.currentUser.uty != UserType.CustomerSupport
    && req.currentUser.uty != UserType.PartnerRosterManager
    && req.currentUser.uty != UserType.PartnerSuperuser) {
    throw new NotAuthorizedError();
  }
  next();
};
