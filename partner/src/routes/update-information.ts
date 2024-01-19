import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireSuperAdminAuth, validateRequest, NotFoundError } from '@unifycaredigital/aem';
import { PartnerInfo } from '../models/partner-information'
import { PartnerInformationUpdatedPublisher } from '../events/publishers/partner-information-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/partner/sudo/information',
  requireSuperAdminAuth,
  [
    body('city').not().isEmpty().withMessage('City is required'),
    body('state').not().isEmpty().withMessage('State is required'),
    body('country').not().isEmpty().withMessage('Country is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      corporateIdStatus, corporateTaxIdStatus, goodsAndServicesTaxIdStatus, partnerInfoStatus
    } = req.body;

    const partnerID = req.currentUser!.fid;

    const partnerInfo = await PartnerInfo.findById(partnerID);

    if (!partnerInfo) {
      throw new NotFoundError();
    }

    partnerInfo.set({
      corporateIdStatus: corporateIdStatus,
      corporateTaxIdStatus: corporateTaxIdStatus,
      goodsAndServicesTaxIdStatus: goodsAndServicesTaxIdStatus,
      partnerInfoStatus: partnerInfoStatus,

    });
    ////// Send PartnerInformationUpdated Event
    new PartnerInformationUpdatedPublisher(natsWrapper.client).publish({
      id: partnerInfo.id!,
      partnerId: partnerInfo.partnerId,
      legalName: partnerInfo.legalName,
      ownerOrganisationUID: partnerInfo.ownerOrganisationUID,
      addressLine1: partnerInfo.addressLine1,
      addressLine2: partnerInfo.addressLine2,
      city: partnerInfo.city,
      state: partnerInfo.state,
      country: partnerInfo.country,
      pincode: partnerInfo.pincode,
      status: partnerInfo.status
    });
    await partnerInfo.save();
    const apiResponse = {
      status: 200,
      message: 'Success',
      data: partnerInfo
    }
    res.send(apiResponse);
  }
);

export { router as updateInfoRouter };
