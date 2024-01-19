import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { validateRequest, ApiResponse } from "@unifycaredigital/aem";
import { City } from "../model/city";

const router = express.Router();

router.post(
  "/api/utility/city",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("stateName").not().isEmpty().withMessage("State name is required"),
    body("countryName").not().isEmpty().withMessage("Country Name is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
		cityId,
		cityName,
		stateId,
		stateCode,
		stateName,
		countryId,
		countryCode,
		countryName
    } = req.body;

    const id = new mongoose.Types.ObjectId().toHexString();
    const city = City.build({
      id,
	  cityId,
	  cityName,
	  stateId,
	  stateCode,
	  stateName,
	  countryId,
	  countryCode,
	  countryName
    });

    // save city object
    await city.save();


	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: city
	}

    res.send(apiResponse);
  }
);

export { router as createCityRouter };
