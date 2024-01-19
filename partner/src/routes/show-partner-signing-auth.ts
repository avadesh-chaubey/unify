import express, { Request, Response } from 'express';
import { requirePartnerSuperuserAuth,requireRosterManagerAuth, requireAuth } from '@unifycaredigital/aem';
import { PartnerSigningAuth } from '../models/partner-signing-auth';

const router = express.Router();

router.get('/api/partner/signingauth/:partnerId', requireAuth, async (req: Request, res: Response) => {
  const partner = await PartnerSigningAuth.findOne({ partnerId: req.params.partnerId });

  const apiResponse = {
    status: 200,
    message: 'Success',
    data: partner
  };
  res.send(apiResponse);
});

export { router as showPartnerSigningAuthRouter };
