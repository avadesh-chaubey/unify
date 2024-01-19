import { ApiResponse, NotFoundError, requireConsultantAuth } from '@unifycaredigital/aem';
import express, { Request, Response } from 'express';
import { PartnerEmployee } from '../models/partner-employee';


const router = express.Router();

router.get(
  '/api/partner/doctordetails/:uniqueId',
  async (req: Request, res: Response) => {
    let uniqueId = req.params.uniqueId
    if (await PartnerEmployee.find({ uniqueId: uniqueId }).count() === 0) {
      throw new NotFoundError();
    }
    const doctorData = await PartnerEmployee.find({ uniqueId: uniqueId });
    let apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: doctorData!
    };
    res.send(apiResponse);
  });

export { router as findDoctorDetailsRouter };
