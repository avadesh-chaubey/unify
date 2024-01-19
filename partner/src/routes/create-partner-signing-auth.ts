import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireRosterManagerAuth,
  validateRequest,
  KYCStatus,
  DocumentStatus,
  PartnerType,
  PartnerStates,
  ApiResponse
} from '@unifycaredigital/aem';
import { PartnerState } from '../models/partner-state';
import { PartnerSigningAuth } from '../models/partner-signing-auth';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/partner/signingauth',
  requireRosterManagerAuth,
  [
    body('signingAuthName').not().isEmpty().withMessage('Signing Authority Name is required'),
    body('signingAuthWorkEmail').isEmail().withMessage('Email must be valid'),
    body('signingAuthTaxId').not().isEmpty().withMessage('Tax Id is required'),
    body('partnerId').not().isEmpty().withMessage('Partner Id is required'),
    body('signingAuthTitle').not().isEmpty().withMessage('Singing Authority Title is required'),
    body('signingAuthTaxIdUrl').not().isEmpty().withMessage('Singing Authority Image is required'),
    body('signingAuthLetterUrl').not().isEmpty().withMessage('Signing Authority Letter Image is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      partnerId, signingAuthName, signingAuthWorkEmail, signingAuthTaxId,
      signingAuthTaxIdUrl, signingAuthTitle,
      signingAuthLetterUrl,
    } = req.body;

    let partnerType = PartnerType.MainBranch;

    //const partnerID = req.currentUser!.fid;

    let partnerInfo = await PartnerSigningAuth.findOne({ partnerId: partnerId });

    if (partnerInfo) {

      partnerInfo.set({
        partnerType: partnerType,
        partnerSigningAuthStatus: KYCStatus.Unverified,
        signingAuthName: signingAuthName,
        signingAuthWorkEmail: signingAuthWorkEmail,
        signingAuthTaxId: signingAuthTaxId,
        signingAuthTaxIdUrl: signingAuthTaxIdUrl,
        signingAuthTaxIdStatus: DocumentStatus.Unverified,
        signingAuthTitle: signingAuthTitle,
        signingAuthLetterUrl: signingAuthLetterUrl,
        signingAuthLetterStatus: DocumentStatus.Unverified,
      });
      await partnerInfo.save();
    } else {

      partnerInfo = PartnerSigningAuth.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        superuserId: req.currentUser!.id,
        partnerType: partnerType,
        partnerSigningAuthStatus: KYCStatus.Unverified,
        signingAuthName: signingAuthName,
        signingAuthWorkEmail: signingAuthWorkEmail,
        signingAuthTaxId: signingAuthTaxId,
        signingAuthTaxIdUrl: signingAuthTaxIdUrl,
        signingAuthTaxIdStatus: DocumentStatus.Unverified,
        signingAuthTitle: signingAuthTitle,
        signingAuthLetterUrl: signingAuthLetterUrl,
        signingAuthLetterStatus: DocumentStatus.Unverified,
        partnerId: partnerId,

      });
      await partnerInfo.save();

      //Update State
      const existingState = await PartnerState.findOne({ partnerId: partnerId });

      if (existingState === undefined || existingState === null) {
        console.log('PartnerState not found for id : ' + partnerId);
      } else {
        existingState.set({
          currentState: PartnerStates.AddPartnerBankingDetails,
        });
        await existingState.save();
      }
    }
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: partnerInfo
    }
    res.send(apiResponse);
  }
);

export { router as createPartnerSigningAuthRouter };
