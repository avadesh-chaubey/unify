import express, { Request, Response } from "express";
import { requireAuth, ApiResponse } from "@unifycaredigital/aem";
import { DoctorProfile } from "../models/doctor-profile";

const router = express.Router();

router.get(
  "/api/partner/searchdoctorprofile",
  requireAuth,
  async (req: Request, res: Response) => {
    let doctorName: string = "";
    let unitId: string = "";
    let specialization: string = "";
    let superSpeciality: string = "";

    if (req.query && req.query.doctorName) {
      doctorName = (req.query as any).doctorName;
      const nameRegExp = new RegExp(doctorName, "i");
      const doctors = await DoctorProfile.find({ doctorFullName: nameRegExp });
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: doctors
      }
      res.send(apiResponse);
    } else if (req.query && unitId) {
      unitId = (req.query as any).unitId;
      const doctors = await DoctorProfile.find({ unitId: unitId });
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: doctors
      }
      res.send(apiResponse);
    } else if (req.query && unitId && specialization) {
      unitId = (req.query as any).unitId;
      specialization = (req.query as any).specialization;
      const doctors = await DoctorProfile.find({ specialization: specialization });
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: doctors
      }
      res.send(apiResponse);
    } else if (req.query && unitId && specialization && superSpeciality) {
      unitId = (req.query as any).unitId;
      specialization = (req.query as any).specialization;
      superSpeciality = (req.query as any).superSpeciality;
      const doctors = await DoctorProfile.find({ specialization: specialization, superSpeciality: superSpeciality });
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: doctors
      }
      res.send(apiResponse);
    }
    else {
      const doctors = await DoctorProfile.find();
      const apiResponse: ApiResponse = {
        status: 200,
        message: 'Success',
        data: doctors
      }
      res.send(apiResponse);
    }
  });

export { router as showSearchDoctorProfileRouter };
