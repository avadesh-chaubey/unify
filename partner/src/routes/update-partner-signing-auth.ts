import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, KYCStatus, DocumentStatus, requireRosterManagerAuth, ApiResponse } from '@unifycaredigital/aem';
import { PartnerSigningAuth } from '../models/partner-signing-auth'

const router = express.Router();

router.put(
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
      signingAuthLetterUrl
    } = req.body;

    //const partnerID = req.currentUser!.fid;

    const partnerSigningAuth = await PartnerSigningAuth.findOne({ partnerId: partnerId });

    if (!partnerSigningAuth) {
      throw new NotFoundError();
    }

    partnerSigningAuth.set({
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
    await partnerSigningAuth.save();
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: partnerSigningAuth
    }
    res.send(apiResponse);
  }
);

export { router as updatePartnerSigningAuthRouter };
