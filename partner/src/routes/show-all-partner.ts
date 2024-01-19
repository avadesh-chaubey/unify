import { requireRosterManagerAuth, ApiResponse } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';
import { PartnerInfo } from '../models/partner-information';

const router = express.Router();

router.get('/api/partner/allpartner', async (req: Request, res: Response) => {

  const partners = await PartnerInfo.find({});
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: partners
  }
  res.send(apiResponse);
});

export { router as showAllPartnerRouter };
