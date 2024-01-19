import express, { Request, Response } from 'express';
import { requireAuth, requireConsultantAuth, UserType } from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';

const router = express.Router();

router.get('/api/partner/assistants', requireConsultantAuth, async (req: Request, res: Response) => {

  const assitants = await PartnerEmployee.find({ userType: UserType.PhysicianAssistant });
  const apiResponse = {
    status: 200,
    message: 'Success',
    data: assitants
  };
  res.send(apiResponse);
});

export { router as showAllAssistantsRouter };
