import { ApiResponse } from "@unifycaredigital/aem";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/utility/documents-categories", async (req: Request, res: Response) => {

  const categories = ["Test reports",
    "Prescription",
    "Patient photo",
    "Travel advisory",
    "Diet Plan",
    "Education"]

 const apiResponse: ApiResponse = {
	status: 200,
	message: 'Success',
	data: categories
	}
  res.send(apiResponse);
});

export { router as showAllCategoriesRouter };
