import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, NotFoundError, ApiResponse } from "@unifycaredigital/aem";
import { Medicine } from "../model/medicine";

const router = express.Router();

router.put(
  "/api/utility/medicine/:id",
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

    const id = req.params.id;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      throw new NotFoundError();
    }

    medicine.set({
      medicineType,
      medicineName,
      packOf,
      MRP,
      gstInPercentage,
      hsnCode
    });

    // save MedicineType object
    await medicine.save();
	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: medicine
	}

    res.status(200).send(apiResponse);
  }
);

export { router as updateMedicineRouter };
