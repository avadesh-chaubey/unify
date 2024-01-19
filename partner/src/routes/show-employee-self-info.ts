import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, requireEmployeeAuth } from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';

const router = express.Router();

router.get('/api/partner/employeeselfinfo', requireEmployeeAuth, async (req: Request, res: Response) => {
  const partnerEmployee = await PartnerEmployee.findById(req.currentUser!.id);

  if (!partnerEmployee) {
    throw new NotFoundError();
  }
  const apiResponse = {
    status: 200,
    message: 'Success',
    data: partnerEmployee
  };
  
  res.send(apiResponse);
});

export { router as showEmployeeSelfInfoRouter };
