import express, { Request, Response } from "express";
import { NotFoundError, requireAuth, ApiResponse } from "@unifycaredigital/aem";
import { Medicine } from "../model/medicine";

const router = express.Router();

router.get(
  "/api/utility/deletemedicine/:id",
  requireAuth,
  async (req: Request, res: Response) => {

    const id = req.params.id;

    const medicine = await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      throw new NotFoundError();
    }
    const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: medicine
	}
    res.send(apiResponse);
  }
);

export { router as deleteMedicineRouter };
