import { ApiResponse } from "@unifycaredigital/aem";
import express, { Request, Response } from "express";
import { Country } from "../model/country";

const router = express.Router();

router.get(
  "/api/utility/countryandisd",
  async (req: Request, res: Response) => {

    // let apiResponse: ApiResponse = {
    //   status: 400,
    //   message: 'Failure',
    //   data: {}
    // }


    const allCountriesWithISDCode = await Country.find({}, { _id: 0, countryName: 1, phoneCode: 1 }).sort({ countryName: 1 });
    if (allCountriesWithISDCode) {
        const apiResponse :ApiResponse  = {
        status: 200,
        message: 'Success',
        data: allCountriesWithISDCode
      }
	  res.send(apiResponse);
    }

  });

export { router as showCountryAndISDCodeRouter };
