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
import { PartnerBankDetails } from '../models/partner-bank-details';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/partner/bankdetails',
  requireRosterManagerAuth,
  [
    body('bankAccountName').not().isEmpty().withMessage('Bank Account Name is required'),
    body('bankAccountNumber').not().isEmpty().withMessage('Bank Account Number is required'),
    body('bankName').not().isEmpty().withMessage('Bank Name is required'),
    body('partnerId').not().isEmpty().withMessage('Partner Id is required'),
    body('bankIFSCCode').not().isEmpty().withMessage('Bank IFSC code is required'),
    body('bankChequeURL').not().isEmpty().withMessage('Bank Cheque is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      partnerId, bankAccountName, bankAccountNumber, bankAccountType, bankIFSCCode,
      bankName, bankChequeURL
    } = req.body;

    const partnerType = PartnerType.Branch;

    //const partnerID = req.currentUser!.fid;

    let bankDetail = await PartnerBankDetails.findOne({ partnerId: partnerId });
    console.log("========== BankDetail " + bankDetail)
    if (bankDetail) {

      bankDetail.set({
        partnerType: partnerType,
        partnerBankDetailsStatus: KYCStatus.Unverified,
        bankAccountName: bankAccountName,
        bankAccountNumber: bankAccountNumber,
        bankAccountType: bankAccountType,
        bankIFSCCode: bankIFSCCode,
        bankName: bankName,
        bankChequeURL: bankChequeURL,
        bankChequeStatus: DocumentStatus.Unverified,

      });
      await bankDetail.save();
    } else {

      bankDetail = PartnerBankDetails.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        superuserId: req.currentUser!.id,
        partnerType: partnerType,
        partnerBankDetailsStatus: KYCStatus.Unverified,
        bankAccountName: bankAccountName,
        bankAccountNumber: bankAccountNumber,
        bankAccountType: bankAccountType,
        bankIFSCCode: bankIFSCCode,
        bankName: bankName,
        bankChequeURL: bankChequeURL,
        bankChequeStatus: DocumentStatus.Unverified,
        partnerId: partnerId

      });
      await bankDetail.save();

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
        data: bankDetail
      }
      res.send(apiResponse);
    }
  }
);

export { router as createPartnerBankDetailsRouter };
