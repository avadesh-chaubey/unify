import express, { Request, Response } from 'express';
import { requireRosterManagerAuth } from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';

const router = express.Router();

router.get('/api/partner/employee', requireRosterManagerAuth, async (req: Request, res: Response) => {
  const partnerEmployee = await PartnerEmployee.find({});

  const newList = [];
  for (let i = 0; i < partnerEmployee.length; i++) {

    if (partnerEmployee[i].emailId === `${String(process.env.MASTER_ROSTER_EMAIL_ID)}`) { continue; }

    newList.push(partnerEmployee[i]);
  }
  const apiResponse = {
    status: 200,
    message: 'Success',
    data: newList
  };
  res.send(apiResponse);
});

export { router as showAllPartnerEmployeeRouter };
