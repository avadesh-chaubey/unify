import express, { Request, Response } from "express";
import { SpecialityType } from "../model/speciality-type";
import { ApiResponse } from "@unifycaredigital/aem";

const router = express.Router();

router.get(
  "/api/utility/specialityType",
  async (req: Request, res: Response) => {
    let specialityType: string = "";
    if (req.query && req.query.specialityType) {
      specialityType = String(req.query.specialityType).toUpperCase();
    }

    if (specialityType != "") {
      const nameRegexp = new RegExp("^" + specialityType, "i");
      let speciality = await SpecialityType.find({ specialityType: nameRegexp });
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: speciality
	  }
      res.send(apiResponse);
    } else {
      let speciality = await SpecialityType.find({});
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: speciality
	  }
      res.send(apiResponse);
    }
  }
);

export { router as showAllSpecialityRouter };
