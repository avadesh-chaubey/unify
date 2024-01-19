import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireSuperAdminAuth, validateRequest, NotFoundError } from '@unifycaredigital/aem';
import { PartnerSigningAuth } from '../models/partner-signing-auth'

const router = express.Router();

router.put(
  '/api/partner/sudo/signingauth',
  requireSuperAdminAuth,
  [
    body('signingAuthName').not().isEmpty().withMessage('Signing Authority Name is required'),
    body('signingAuthWorkEmail').isEmail().withMessage('Email must be valid'),
    body('signingAuthTaxId').not().isEmpty().withMessage('Tax Id is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      signingAuthTaxIdStatus, signingAuthLetterStatus, partnerSigningAuthStatus
    } = req.body;

    const partnerID = req.currentUser!.fid;

    const partnerSigningAuth = await PartnerSigningAuth.findById(partnerID);

    if (!partnerSigningAuth) {
      throw new NotFoundError();
    }

    partnerSigningAuth.set({
      partnerSigningAuthStatus: partnerSigningAuthStatus,
      signingAuthTaxIdStatus: signingAuthTaxIdStatus,
      signingAuthLetterStatus: signingAuthLetterStatus,

    });
    await partnerSigningAuth.save();
    const apiResponse = {
      status: 200,
      message: 'Success',
      data: partnerSigningAuth
    }
    res.send(apiResponse);
   
  }
);

export { router as updateSigningAuthRouter };
