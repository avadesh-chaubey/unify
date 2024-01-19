import express, { Request, Response } from 'express';
import { PartnerState } from '../models/partner-state';
import { requirePartnerSuperuserAuth, NotFoundError } from '@unifycaredigital/aem';

const router = express.Router();

router.get('/api/partner', requirePartnerSuperuserAuth, async (req: Request, res: Response) => {
  const partnerId = req.currentUser!.fid;
  const partnerState = await PartnerState.findById(partnerId);
  const apiResponse = {
    status: 200,
    message: 'Success',
    data: partnerState
  };
  res.send(apiResponse);
});

export { router as indexPartnerStateRouter };
