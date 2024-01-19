import express, { Request, Response } from 'express';
import { requirePartnerSuperuserAuth,requireRosterManagerAuth,requireAuth } from '@unifycaredigital/aem';
import { PartnerBankDetails } from '../models/partner-bank-details';

const router = express.Router();

router.get('/api/partner/bankdetails/:partnerId', requireAuth, async (req: Request, res: Response) => {
  const partner = await PartnerBankDetails.findOne({ partnerId: req.params.partnerId });
  const apiResponse = {
    status: 200,
    message: 'Success',
    data: partner
  };
  res.send(apiResponse);
});

export { router as showPartnerBankDetailsRouter };
