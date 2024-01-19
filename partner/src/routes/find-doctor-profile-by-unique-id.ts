import { requireAuth, ApiResponse } from "@unifycaredigital/aem";
import express, { Request, Response } from 'express';
import { DoctorProfile } from '../models/doctor-profile';


const router = express.Router();

router.get(
  '/api/partner/doctorprofile/:uniqueId',
  async (req: Request, res: Response) => {

    const doctorProfile = await DoctorProfile.findOne({ uniqueId: req.params.uniqueId });
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: doctorProfile!
    }
    res.send(apiResponse);

  });

export { router as findDoctorProfileRouter };
