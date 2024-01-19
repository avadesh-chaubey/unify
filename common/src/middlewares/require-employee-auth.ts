import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { UserType } from '../types/user-type'
import { UserStatus } from '../types/user-status'

export const requireEmployeeAuth = (
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
  if (req.currentUser.uty != UserType.Doctor
    && req.currentUser.uty != UserType.Educator
    && req.currentUser.uty != UserType.Nutritionist
    && req.currentUser.uty != UserType.PartnerRosterManager
    && req.currentUser.uty != UserType.Diabetologist
    && req.currentUser.uty != UserType.PartnerManager
    && req.currentUser.uty != UserType.Dietician
    && req.currentUser.uty != UserType.PartnerEmployeeAdmin
    && req.currentUser.uty != UserType.PhysicianAssistant
    && req.currentUser.uty != UserType.PartnerSuperuser
    && req.currentUser.uty != UserType.OCAdmin
    && req.currentUser.uty != UserType.OCDeliveryVolunteer
    && req.currentUser.uty != UserType.OCRequestManager
    && req.currentUser.uty != UserType.Employee
    && req.currentUser.uty != UserType.Staff) {
    throw new NotAuthorizedError();
  }
  next();
};
