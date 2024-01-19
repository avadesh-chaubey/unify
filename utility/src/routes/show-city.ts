import { BadRequestError, ApiResponse } from "@unifycaredigital/aem";
import express, { Request, Response } from "express";
import { City } from "../model/city";

const router = express.Router();

router.get(
  "/api/utility/city",
  async (req: Request, res: Response) => {

    let apiResponse;
	let countryName: string = "";
    let stateName: string = "";

	if (req.query && req.query.countryName) {
		countryName = (req.query as any).countryName;
	}
	if (req.query && req.query.stateName) {
		stateName = (req.query as any).stateName;
	}

    if (countryName !== "" && stateName !== "") {
      const countryNameRegExp = new RegExp(countryName, 'i');
      const stateNameRegExp = new RegExp(stateName, 'i');
      const city = await City.find({ countryName: countryNameRegExp, stateName: stateNameRegExp },{_id : 0,cityName :1});
      apiResponse = { status: 200,message: 'Success', data: city }
    }
	else if (countryName !== "") {
	  const countryNameRegexp = new RegExp("^" + countryName, "i");
	  const city = await City.find({ countryName: countryNameRegexp },{_id : 0,cityName :1});
	  apiResponse = { status: 200,message: 'Success', data: city }
	}
	else {
      const city = await City.find({},{_id : 0,cityName :1});
      apiResponse = { status: 200, message: 'Success', data: city}
    }
    res.send(apiResponse);
  });

export { router as showCityRouter };
