import express, { Request, Response } from "express";
import { City } from "../model/city";
import { ApiResponse } from "@unifycaredigital/aem";

const router = express.Router();

router.get("/api/utility/cities", async (req: Request, res: Response) => {
  let name: string = "";
  let countryName: string = "";
  let stateName: string = "";
  if (req.query && req.query.name) {
    name = (req.query as any).name;
  }
  if (req.query && req.query.countryName) {
    countryName = (req.query as any).countryName;
  }
  if (req.query && req.query.stateName) {
    stateName = (req.query as any).stateName;
  }

  let cities = await City.find({});

  if (countryName !== "" && stateName !== "") {
    cities = await City.find({
      countryName: countryName,
      stateName: stateName,
    });
  } else if (countryName !== "") {
    let states = await City.distinct("stateName", { countryName: countryName });
	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: states
	}
    res.send(apiResponse);
    return;
  } else if (stateName !== "") {
    const stateNameRegexp = new RegExp("^" + stateName, "i");
    cities = await City.find({ stateName: stateNameRegexp });
  } else if (name != "") {
    const nameRegexp = new RegExp("^" + name, "i");
    cities = await City.find({ name: nameRegexp });
  }
  const apiResponse: ApiResponse = {
	status: 200,
	message: 'Success',
	data: cities
   }
  res.send(apiResponse);
});

export { router as showAllCitiesRouter };
