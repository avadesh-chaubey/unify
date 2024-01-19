import express, { Request, Response } from 'express';
import { requireSuperAdminAuth, validateRequest, NotFoundError } from '@unifycaredigital/aem';
import { PartnerBankDetails } from '../models/partner-bank-details'

const router = express.Router();

router.put(
  '/api/partner/sudo/bankdetails',
  requireSuperAdminAuth,
  async (req: Request, res: Response) => {

    const {
      bankChequeStatus, partnerBankDetailsStatus
    } = req.body;

    const partnerID = req.currentUser!.fid;

    const partnerBankDetails = await PartnerBankDetails.findById(partnerID);

    if (!partnerBankDetails) {
      throw new NotFoundError();
    }

    partnerBankDetails.set({
      partnerBankDetailsStatus: partnerBankDetailsStatus,
      bankChequeStatus: bankChequeStatus,
    });
    await partnerBankDetails.save();
    const apiResponse = {
      status: 200,
      message: 'Success',
      data: partnerBankDetails
    }
    res.send(apiResponse);
  }
);

export { router as updateBankDetailsRouter };
