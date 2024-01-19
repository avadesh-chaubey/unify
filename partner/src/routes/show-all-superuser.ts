import express, { Request, Response } from 'express';
import { requireSuperAdminAuth } from '@unifycaredigital/aem';
import { PartnerSuperuser } from '../models/partner-superuser';

const router = express.Router();

router.get('/api/partner/sudo/superuser', requireSuperAdminAuth, async (req: Request, res: Response) => {

  const partnerSuperuser = await PartnerSuperuser.find({});
  const apiResponse = {
    status: 200,
    message: 'Success',
    data: partnerSuperuser
  };
  res.send(apiResponse);
});

export { router as showAllPartnerSuperuserRouter };
