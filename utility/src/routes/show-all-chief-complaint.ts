import express, { Request, Response } from "express";
import { ChiefComplaint } from "../model/chief-complaint";
import {  ApiResponse } from "@unifycaredigital/aem";

const router = express.Router();

router.get(
  "/api/utility/chiefcomplaints",
  async (req: Request, res: Response) => {
    let chiefComplaint: string = "";
    if (req.query && req.query.chiefComplaint) {
      chiefComplaint = (req.query as any).chiefComplaint;
    }

    if (chiefComplaint != "") {
      const nameRegexp = new RegExp("^" + chiefComplaint, "i");
      let chiefcomplaint = await ChiefComplaint.find({ chiefComplaint: nameRegexp });
      const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: chiefcomplaint
	  }
      res.send(apiResponse);
    } else {
      let chiefcomplaint = await ChiefComplaint.find({});
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: chiefcomplaint
	  }
      res.send(apiResponse);
    }
  }
);

export { router as showAllChiefComplaintsRouter };
