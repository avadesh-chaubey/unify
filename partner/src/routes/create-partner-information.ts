import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireRosterManagerAuth,
  validateRequest,
  BadRequestError,
  KYCStatus,
  DocumentStatus,
  PartnerType,
  PartnerStates,
  ApiResponse
} from '@unifycaredigital/aem';
import { PartnerState } from '../models/partner-state';
import { PartnerInfo } from '../models/partner-information';
import mongoose from 'mongoose';
import { PartnerInformationUpdatedPublisher } from '../events/publishers/partner-information-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
import { PartnerInformationCreatedPublisher } from '../events/publishers/partner-information-created-publisher';

const router = express.Router();

router.post(
  '/api/partner/information',
  requireRosterManagerAuth,
  [
    body('city').not().isEmpty().withMessage('City is required'),
    body('state').not().isEmpty().withMessage('State is required'),
    body('country').not().isEmpty().withMessage('Country is required'),
    body('phoneNumber').not().isEmpty().withMessage('Phone Number is required'),
    body('legalName').not().isEmpty().withMessage('Legal Name is required'),
    body('website').not().isEmpty().withMessage('Web Site is required'),
    body('ownerOrganisationUID').not().isEmpty().withMessage('ownerOrganisationUID is required'),
    body('addressLine1').not().isEmpty().withMessage('Address1 is required'),
    body('pincode').not().isEmpty().withMessage('Pincode is required'),
    body('corporateId').not().isEmpty().withMessage('Corporate Id is required'),
    body('corporateIdUrl').not().isEmpty().withMessage('Corporate Id Url is required'),
    body('corporateTaxId').not().isEmpty().withMessage('Corporate Tax Id is required'),
    body('corporateTaxIdUrl').not().isEmpty().withMessage('Corporate Tax Id Url is required'),
    body('goodsAndServicesTaxId').not().isEmpty().withMessage('Goods and Service Tax Id is required'),
    body('goodsAndServicesTaxIdUrl').not().isEmpty().withMessage('Goods and Service Tax Url is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      partnerId, legalName, website, ownerOrganisationUID,
      addressLine1, addressLine2, city, state, country,
      pincode, corporateId, corporateIdUrl, corporateTaxId, corporateTaxIdUrl, goodsAndServicesTaxId,
      goodsAndServicesTaxIdUrl, phoneNumber, tollFreeNumber, status
    } = req.body;

    //const partnerID = req.currentUser!.fid;

    let partnerInfo = await PartnerInfo.findOne({ partnerId: partnerId });

    if (partnerInfo) {
      console.log('found partner info ....should not happen');

      partnerInfo.set({
        ownerOrganisationUID: ownerOrganisationUID,
        legalName: legalName,
        website: website,
        services: 'NA',
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
    } else {

      const existingCorporateId = await PartnerInfo.findOne({ corporateId });
      if (existingCorporateId) {
        throw new BadRequestError('Partner already Exist with Same Corporate ID');
      }

      const existingCorporateTaxId = await PartnerInfo.findOne({ corporateTaxId });
      if (existingCorporateTaxId) {
        throw new BadRequestError('Partner already Exist with Same Corporate Tax ID');
      }

      const existingGSTId = await PartnerInfo.findOne({ goodsAndServicesTaxId });
      if (existingGSTId) {
        throw new BadRequestError('Partner already Exist with Same GST ID');
      }

	  const existingLegalName = await PartnerInfo.findOne({ legalName });
      if (existingLegalName) {
        throw new BadRequestError('Partner already Exist with Same Legal Name');
      }

      let partnerType = PartnerType.MainBranch;
      const partnerId = new mongoose.Types.ObjectId().toHexString();
      partnerInfo = PartnerInfo.build({
        id: partnerId,
        ownerOrganisationUID: ownerOrganisationUID,
        superuserId: req.currentUser!.id,
        partnerType: partnerType,
        legalName: legalName,
        website: website,
        services: 'NA',
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
        partnerId: partnerId,
        phoneNumber: phoneNumber,
        tollFreeNumber: tollFreeNumber,
        status: status
      });

      await partnerInfo.save();
      ////// Send PartnerInformationCreated Event
      new PartnerInformationCreatedPublisher(natsWrapper.client).publish({
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
      //Update State
      const existingState = await PartnerState.findOne({ partnerId: partnerId });

      if (existingState === null || existingState === undefined) {
        const partnerState = PartnerState.build({
          id: new mongoose.Types.ObjectId().toHexString(),
          superuserId: req.currentUser!.id,
          partnerId: partnerInfo.partnerId,
          partnerType: partnerType,
          currentState: PartnerStates.AddPartnerInformation
        });
        await partnerState.save();
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

export { router as createPartnerInfoRouter };
