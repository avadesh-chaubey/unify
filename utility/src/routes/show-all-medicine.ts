import express, { Request, Response } from "express";
import { Medicine } from "../model/medicine";
import { ApiResponse } from "@unifycaredigital/aem";

const router = express.Router();

router.get(
  "/api/utility/medicine",
  async (req: Request, res: Response) => {
    let medicineName: string = "";
    let id: string = "";
    if (req.query && req.query.medicineName) {
      medicineName = (req.query as any).medicineName;
    }else if (req.query && req.query.id) {
      id = (req.query as any).id;
    }

    if( id!= ""){
      let medicine = await Medicine.findById(id);
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: medicine!
	  }
      res.send(apiResponse);
    }else if (medicineName != "") {
      if(medicineName === "0"){
        const nameRegexp = new RegExp("^[0-9]");
        let medicine = await Medicine.find({ medicineName: nameRegexp });
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: medicine
		}
        res.send(apiResponse);
      } else {
      const nameRegexp = new RegExp("^" + medicineName, "i");
      let medicine = await Medicine.find({ medicineName: nameRegexp });
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: medicine
	  }
      res.send(apiResponse);
      }
    } else {
      let medicine = await Medicine.find({});
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: medicine
	  }
      res.send(apiResponse);
    }
  }
);

export { router as showAllMedicinesRouter };
