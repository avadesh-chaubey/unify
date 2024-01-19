import express, { Request, Response } from "express";
import { SurgeryType } from "../model/surgery-type";
import { ApiResponse } from "@unifycaredigital/aem";

const router = express.Router();

router.get(
  "/api/utility/surgerytype",
  async (req: Request, res: Response) => {
    let surgeryType: string = "";
    if (req.query && req.query.surgeryType) {
      surgeryType = String(req.query.surgeryType).toUpperCase();
    }

    if (surgeryType != "") {
      const nameRegexp = new RegExp("^" + surgeryType, "i");
      let type = await SurgeryType.find({ surgeryType: nameRegexp });
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: type
	  }
      res.send(apiResponse);
    } else {
      let type = await SurgeryType.find({});
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: type
	  }
      res.send(apiResponse);
    }
  }
);

export { router as showAllSurgeryTypesRouter };
