import express, { Request, Response } from 'express';
import { BadRequestError, requireRosterManagerAuth, ApiResponse } from '@unifycaredigital/aem';
import { PartnerInfo } from '../models/partner-information';

const router = express.Router();
var allPartner: any[] = [];

router.get('/api/partner/searchpartnerbycity/:city', requireRosterManagerAuth, async (req: Request, res: Response) => {

  // const partnerIds: any[] = await PartnerInfo.find({ city: req.params.city }, { _id: 0, partnerId: 1 });
  const partnerInfo: any[] = await PartnerInfo.find({ city: req.params.city });

  if (partnerInfo.length < 1) {
    throw new BadRequestError("No Partner found at city: " + req.params.city);
  }

  // if (partnerIds.length === 1) {
  //   const partnerInfo = await PartnerInfo.findOne({ partnerId: partnerIds[0].partnerId });
  //   // const signingAuthorityInfo = await PartnerSigningAuth.findOne({ partnerId: partnerIds[0].partnerId });
  //   // const bankDetailsInfo = await PartnerBankDetails.findOne({ partnerId: partnerIds[0].partnerId });
  //   allPartner.push({ "partnerInfo": partnerInfo });
  // }


  // for (var i = 0; i < partnerIds.length - 1; i++) {

  //   const partnerInfo = await PartnerInfo.findOne({ partnerId: partnerIds[i].partnerId });
  //   // const signingAuthorityInfo = await PartnerSigningAuth.findOne({ partnerId: partnerIds[i].partnerId });
  //   // const bankDetailsInfo = await PartnerBankDetails.findOne({ partnerId: partnerIds[i].partnerId });
  //   allPartner.push(
  //     {
  //       "partnerInfo": partnerInfo,
  //       // "signingAuthorityInfo": signingAuthorityInfo,
  //       // "bankDetailsInfo": bankDetailsInfo
  //     });
  // }
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: partnerInfo
  }
  res.send(apiResponse);
});

export { router as showSearchPartnerByCityRouter };
