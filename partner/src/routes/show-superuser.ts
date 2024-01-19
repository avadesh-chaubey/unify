import express, { Request, Response } from 'express';
import { NotFoundError, requireSuperAdminAuth } from '@unifycaredigital/aem';
import { PartnerSuperuser } from '../models/partner-superuser';

const router = express.Router();

router.get('/api/partner/sudo/superuser/:id', requireSuperAdminAuth, async (req: Request, res: Response) => {

  const partnerSuperuser = await PartnerSuperuser.findById(req.params.id);

  if (!partnerSuperuser) {
    throw new NotFoundError();
  }
  const apiResponse = {
    status: 200,
    message: 'Success',
    data: partnerSuperuser
  }
  res.send(apiResponse);
});

export { router as showPartnerSuperuserRouter };
