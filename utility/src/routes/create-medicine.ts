import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { validateRequest, BadRequestError, ApiResponse } from "@unifycaredigital/aem";
import { Medicine } from "../model/medicine";

const router = express.Router();

router.post(
  "/api/utility/medicine",
  [
    body("medicineType").not().isEmpty().withMessage("Medicine type is required"),
    body("medicineName").not().isEmpty().withMessage("Medicine Name is required"),
    body("packOf").not().isEmpty().withMessage("Package Of is required"),
    body("MRP").not().isEmpty().withMessage("MRP is required"),
    body("gstInPercentage").not().isEmpty().withMessage("GST In Percentage is required"),
    body("hsnCode").not().isEmpty().withMessage("HSN Code is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { medicineType, medicineName, packOf, MRP, gstInPercentage, hsnCode } = req.body;

    const currentmedicine = await Medicine.findOne({ medicineType: medicineType, medicineName: medicineName });
    if (currentmedicine) {
      return new BadRequestError("Medicine already exist with same Name and Type.");
    }

    const id = new mongoose.Types.ObjectId().toHexString();
    const medicineTypeTable = Medicine.build({
      id,
      medicineType,
      medicineName,
      packOf,
      MRP,
      gstInPercentage,
      hsnCode
    });

    // save medicineType object
    await medicineTypeTable.save();

	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: medicineTypeTable
	}

    res.send(apiResponse);
  }
);

export { router as createMedicineRouter };
