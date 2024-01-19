import express, { Request, Response } from 'express';
import { requirePartnerSuperuserAuth,requireRosterManagerAuth } from '@unifycaredigital/aem';
import { PartnerInfo } from '../models/partner-information';

const router = express.Router();

router.get('/api/partner/information/:partnerId', requireRosterManagerAuth, async (req: Request, res: Response) => {
  const partner = await PartnerInfo.findOne({ partnerId: req.params.partnerId });
  const apiResponse = {
    status: 200,
    message: 'Success',
    data: partner
  };
  res.send(apiResponse);
});

export { router as showPartnerInfoRouter };
