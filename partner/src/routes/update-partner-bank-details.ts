import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, KYCStatus, DocumentStatus, requireRosterManagerAuth, ApiResponse } from '@unifycaredigital/aem';
import { PartnerBankDetails } from '../models/partner-bank-details'

const router = express.Router();

router.put(
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

    //const partnerID = req.currentUser!.fid;

    const partnerBankDetails = await PartnerBankDetails.findOne({ partnerId: partnerId });

    if (!partnerBankDetails) {
      throw new NotFoundError();
    }

    partnerBankDetails.set({
      partnerBankDetailsStatus: KYCStatus.Unverified,
      bankAccountName: bankAccountName ? bankAccountName : partnerBankDetails.bankAccountName,
      bankAccountNumber: bankAccountNumber ? bankAccountNumber : partnerBankDetails.bankAccountNumber,
      bankIFSCCode: bankIFSCCode ? bankIFSCCode : partnerBankDetails.bankIFSCCode,
      bankAccountType: bankAccountType ? bankAccountType : partnerBankDetails.bankAccountType,
      bankName: bankName ? bankName : partnerBankDetails.bankName,
      bankChequeURL: bankChequeURL ? bankChequeURL : partnerBankDetails.bankChequeURL,
      bankChequeStatus: DocumentStatus.Unverified,
    });
    await partnerBankDetails.save();
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: partnerBankDetails
    }
    res.send(apiResponse);
  }
);

export { router as updatePartnerBankDetailsRouter };
