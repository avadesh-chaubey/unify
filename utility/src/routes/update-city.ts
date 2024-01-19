import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, NotFoundError, ApiResponse } from "@unifycaredigital/aem";
import { City } from "../model/city";

const router = express.Router();

router.put(
  "/api/utility/city/:id",
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

    const id = req.params.id;

    const city = await City.findById(id);

    if (!city) {
      throw new NotFoundError();
    }

    city.set({
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

export { router as updateCityRouter };
