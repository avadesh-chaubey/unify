import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { validateRequest, ApiResponse } from "@unifycaredigital/aem";
import { Language } from "../model/language";

const router = express.Router();

router.post(
  "/api/utility/language",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("shortName").not().isEmpty().withMessage("ShortName is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, shortName } = req.body;

    const id = new mongoose.Types.ObjectId().toHexString();
    const language = Language.build({
      id,
      name,
      shortName,
    });

    // save Language object
    await language.save();

	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: language
	}

    res.send(apiResponse);
  }
);

export { router as createLanguageRouter };
