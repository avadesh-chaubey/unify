import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, requireRosterManagerAuth, ApiResponse } from '@unifycaredigital/aem';
import { PartnerLogoInfo } from '../models/partner-logo-prescription'

const router = express.Router();

router.put(
  '/api/partner/partnerLogoInfo',
  requireRosterManagerAuth,
  [
    body('partnerId').not().isEmpty().withMessage('partnerId is required'),
    body('logoUrl').not().isEmpty().withMessage('Partner Logo is required'),
    body('prescriptionUrl').not().isEmpty().withMessage('Partner Prescription is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      partnerId, logoUrl, prescriptionUrl
    } = req.body;

    //const partnerID = req.currentUser!.fid;

    const partnerLogo = await PartnerLogoInfo.findOne({ partnerId: partnerId });

    if (!partnerLogo) {
      throw new NotFoundError();
    }

    partnerLogo.set({
      logoUrl: logoUrl ? logoUrl : partnerLogo.logoUrl,
      prescriptionUrl: prescriptionUrl ? prescriptionUrl : partnerLogo.prescriptionUrl,
    });
    await partnerLogo.save();
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: partnerLogo
    }
    res.status(200).send(apiResponse);
  }
);

export { router as updatePartnerLogoInfoRouter };
