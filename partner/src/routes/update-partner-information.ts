import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, KYCStatus, DocumentStatus, requireRosterManagerAuth, ApiResponse } from '@unifycaredigital/aem';
import { PartnerInfo } from '../models/partner-information'
import { PartnerInformationUpdatedPublisher } from '../events/publishers/partner-information-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/partner/information',
  requireRosterManagerAuth,
  [
    body('city').not().isEmpty().withMessage('City is required'),
    body('state').not().isEmpty().withMessage('State is required'),
    body('country').not().isEmpty().withMessage('Country is required'),
    body('phoneNumber').not().isEmpty().withMessage('Phone Number is required'),
    body('companyLegalName').not().isEmpty().withMessage('Company Legal Name is required'),
    body('companyWebsite').not().isEmpty().withMessage('Company Web Site is required'),
    body('addressLine1').not().isEmpty().withMessage('Address1 is required'),
    body('pincode').not().isEmpty().withMessage('Pincode is required'),
    body('corporateId').not().isEmpty().withMessage('Corporate Id is required'),
    body('corporateIdUrl').not().isEmpty().withMessage('Corporate Id Url is required'),
    body('corporateTaxId').not().isEmpty().withMessage('Corporate Tax Id is required'),
    body('corporateTaxIdUrl').not().isEmpty().withMessage('Corporate Tax Id Url is required'),
    body('goodsAndServicesTaxId').not().isEmpty().withMessage('Goods and Service Tax Id is required'),
    body('goodsAndServicesTaxIdUrl').not().isEmpty().withMessage('Goods and Service Tax Url is required'),
    body('companySize').not().isEmpty().withMessage('Company Size is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      partnerId, companyLegalName, companyWebsite, companySize,
      companyServices, addressLine1, addressLine2, city, state, country,
      pincode, corporateId, corporateIdUrl, corporateTaxId, corporateTaxIdUrl, goodsAndServicesTaxId,
      goodsAndServicesTaxIdUrl, phoneNumber, tollFreeNumber, status
    } = req.body;

    //const partnerID = req.currentUser!.fid;

    const partnerInfo = await PartnerInfo.findById(partnerId);
    console.log("partner id is:" + partnerInfo);

    if (!partnerInfo) {
      throw new NotFoundError();
    }

    partnerInfo.set({
      legalName: companyLegalName,
      website: companyWebsite,
      companySize: companySize,
      services: companyServices,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      country: country,
      pincode: pincode,
      corporateId: corporateId,
      corporateIdUrl: corporateIdUrl,
      corporateIdStatus: DocumentStatus.Unverified,
      corporateTaxId: corporateTaxId,
      corporateTaxIdUrl: corporateTaxIdUrl,
      corporateTaxIdStatus: DocumentStatus.Unverified,
      goodsAndServicesTaxId: goodsAndServicesTaxId,
      goodsAndServicesTaxIdUrl: goodsAndServicesTaxIdUrl,
      goodsAndServicesTaxIdStatus: DocumentStatus.Unverified,
      partnerInfoStatus: KYCStatus.Unverified,
      phoneNumber: phoneNumber,
      tollFreeNumber: tollFreeNumber,
      status: status
    });
    await partnerInfo.save();

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

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: partnerInfo
    }
    res.send(apiResponse);
  }
);

export { router as updatePartnerInfoRouter };
