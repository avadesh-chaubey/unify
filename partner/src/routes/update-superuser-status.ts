import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireSuperAdminAuth, validateRequest, NotFoundError } from '@unifycaredigital/aem';
import { PartnerSuperuser } from '../models/partner-superuser';
import { PartnerSuperuserStatusChangedPublisher } from '../events/publishers/partner-superuser-status-changed-publisher'
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/partner/sudo/superuser',
  requireSuperAdminAuth,
  [
    body('id').not().isEmpty().withMessage('ID is required'),
    body('userStatus').not().isEmpty().withMessage('Partner Status is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { id, userStatus } = req.body;

    const partner = await PartnerSuperuser.findById(id);

    if (!partner) {
      throw new NotFoundError();
    }

    partner.set({
      userStatus: userStatus,
    });

    await partner.save();

    new PartnerSuperuserStatusChangedPublisher(natsWrapper.client).publish({
      id: partner.id!,
      userStatus: partner.userStatus,
    });
    const apiResponse = {
      status: 200,
      message: 'Success',
      data: partner
    }
    res.send(apiResponse);
   
  }
);

export { router as updatePartnerSuperuserStatusRouter };
