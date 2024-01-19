import express, { Request, Response } from "express";
import { MedicineType } from "../model/medicine-type";
import { ApiResponse } from "@unifycaredigital/aem";

const router = express.Router();

router.get(
  "/api/utility/medicinetypes",
  async (req: Request, res: Response) => {
    let medicineType: string = "";
    if (req.query && req.query.medicineType) {
      medicineType = String(req.query.medicineType).toUpperCase();
    }

    if (medicineType != "") {
      const nameRegexp = new RegExp("^" + medicineType, "i");
      let type = await MedicineType.find({ medicineType: nameRegexp });
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: type
	  }
      res.send(apiResponse);
    } else {
      let type = await MedicineType.find({});
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: type
	  }
      res.send(apiResponse);
    }
  }
);

export { router as showAllMedicineTypesRouter };
