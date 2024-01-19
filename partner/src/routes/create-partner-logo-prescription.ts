import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireRosterManagerAuth,
  validateRequest,
  PartnerStates,
  ApiResponse
} from '@unifycaredigital/aem';
import { PartnerState } from '../models/partner-state';
import { PartnerLogoInfo } from '../models/partner-logo-prescription';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/partner/logoandprescription',
  requireRosterManagerAuth,
  [
    body('logoUrl').not().isEmpty().withMessage('Partner Logo is required'),
    body('prescriptionUrl').not().isEmpty().withMessage('Partner prescription is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      partnerId, logoUrl, prescriptionUrl
    } = req.body;

    //const partnerID = req.currentUser!.fid;

    let logoDetail = await PartnerLogoInfo.findOne({ partnerId: partnerId });
    console.log("========== LogoDetail " + logoDetail)
    if (logoDetail) {
      logoDetail.set({
        logoUrl: logoUrl,
        prescriptionUrl: prescriptionUrl,
      });
      await logoDetail.save();
    } else {

      logoDetail = PartnerLogoInfo.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        logoUrl: logoUrl,
        prescriptionUrl: prescriptionUrl,
        partnerId: partnerId

      });
      await logoDetail.save();

      //Update State
      const existingState: any = await PartnerState.findOne({ partnerId: partnerId });
      console.log('PartnerState  found for partnerId : ' + existingState);
      if (existingState === null || existingState === undefined) {
        console.log('PartnerState not found for partnerId : ' + partnerId);
      } else {
        existingState.set({
          currentState: PartnerStates.PartnerVerificationPending,
        });
        await existingState.save();
      }
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: logoDetail
      }
      res.send(apiResponse);
    }
  }
);

export { router as createPartnerLogoInfoRouter };
