import express, { Request, Response } from 'express';
import { requireRosterManagerAuth, ApiResponse,requireAuth } from '@unifycaredigital/aem'
import { PartnerLogoInfo } from '../models/partner-logo-prescription';

const router = express.Router();

router.get('/api/partner/logoInfo/:partnerId', requireAuth, async (req: Request, res: Response) => {
  const partnerLogo = await PartnerLogoInfo.findOne({ partnerId: req.params.partnerId });
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: partnerLogo!
  }
  res.send(apiResponse);
});

export { router as showPartnerLogoInfoRouter };
