import { BadRequestError, ApiResponse } from "@unifycaredigital/aem";
import express, { Request, Response } from "express";
import { Country } from "../model/country";

const router = express.Router();

router.get(
  "/api/utility/country",
  async (req: Request, res: Response) => {
     let  apiResponse : ApiResponse = {
        status: 200,
        message: 'Success',
        data: []
      }

    if (req.query && req.query.countryName) {
      const countryName = (req.query as any).countryName;
      const countryNameRegExp = new RegExp('^' + countryName, 'i');
      const country = await Country.find({ countryName: countryNameRegExp }).sort({ countryName: 1 });
      if (!country) {
        throw new BadRequestError('Country not found');
      }

       apiResponse  = {
        status: 200,
        message: 'Success',
        data: country
      }
    } else {
      const country = await Country.find({}).sort({ countryName: 1 });
        apiResponse ={
        status: 200,
        message: 'Success',
        data: country
      }
    }
    res.send(apiResponse);
  });

export { router as showCountryRouter };
