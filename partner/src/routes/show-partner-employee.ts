import express, { Request, Response } from 'express';
import { NotFoundError, requireRosterManagerAuth } from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';

const router = express.Router();

router.get('/api/partner/employee/:id', requireRosterManagerAuth, async (req: Request, res: Response) => {
  const partnerEmployee = await PartnerEmployee.findById(req.params.id);

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

export { router as showPartnerEmployeeRouter };
