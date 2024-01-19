import express, { Request, Response } from "express";
import { MedicalCondition } from "../model/medical-condition";
import { ApiResponse } from "@unifycaredigital/aem";

const router = express.Router();

router.get(
  "/api/utility/medicalcondition",
  async (req: Request, res: Response) => {
    let medicalCondition: string = "";
    if (req.query && req.query.medicalCondition) {
      medicalCondition = (req.query as any).medicalCondition;
    }

    if (medicalCondition != "") {
      const nameRegexp = new RegExp("^" + medicalCondition, "i");
      let condition = await MedicalCondition.find({ medicalCondition: nameRegexp });
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: condition
	  }
      res.send(apiResponse);
    } else {
      let condition = await MedicalCondition.find({});
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: condition
	  }
      res.send(apiResponse);
    }
  }
);

export { router as showAllMedicalConditionRouter };
