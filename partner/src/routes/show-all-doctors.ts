import express, { Request, Response } from 'express';
import { requireAuth, UserStatus, UserType, ApiResponse } from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';

const router = express.Router();

router.get('/api/partner/doctors', requireAuth, async (req: Request, res: Response) => {

  if (req.currentUser!.uty !== UserType.Patient) {
    const doctors = await PartnerEmployee.find({ isConsultant: true });
    const newList = [];
    for (let i = 0; i < doctors.length; i++) {
      if (doctors[i].userType !== UserType.PartnerRosterManager) {
        newList.push(doctors[i]);
      }
    }
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: newList
    }
    res.send(apiResponse);
  } else if (req.query && req.query.isConsultant) {
    let isConsultant = (req.query as any).isConsultant;
    console.log('req.query.isConsultant: ' + isConsultant);
    const doctors = await PartnerEmployee.find({ isConsultant: isConsultant });
    const newList = [];
    for (let i = 0; i < doctors.length; i++) {
      if (doctors[i].userStatus === UserStatus.Verified
        || doctors[i].userStatus === UserStatus.Active) {
        newList.push(doctors[i]);
      }
    }
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: newList
    }
    res.send(apiResponse);
  } else {
    if (req.query && req.query.userType) {
      let userType = req.query.userType as UserType;
      const doctors = await PartnerEmployee.find({ userType: userType });
      const newList = [];
      for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].userStatus === UserStatus.Verified
          || doctors[i].userStatus === UserStatus.Active) {
          newList.push(doctors[i]);
        }
      }
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: newList
      }
      res.send(apiResponse);
    } else {
      const doctors = await PartnerEmployee.find({ isConsultant: true });
      const newList = [];
      for (let i = 0; i < doctors.length; i++) {
        if (doctors[i].userStatus === UserStatus.Verified
          || doctors[i].userStatus === UserStatus.Active) {
          newList.push(doctors[i]);
        }
      }
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: newList
      }
      res.send(apiResponse);
    }
  }
});

export { router as showAllDoctorsRouter };