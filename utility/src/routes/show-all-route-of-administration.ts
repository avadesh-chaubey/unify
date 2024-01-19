import express, { Request, Response } from "express";
import { RouteOfAdministration } from "../model/route-of-administration";
import { ApiResponse } from "@unifycaredigital/aem";

const router = express.Router();

router.get(
  "/api/utility/routeofadministration",
  async (req: Request, res: Response) => {
    let routeOfAdministration: string = "";
    if (req.query && req.query.routeOfAdministration) {
      routeOfAdministration = String(req.query.routeOfAdministration).toUpperCase();
    }

    if (routeOfAdministration != "") {
      const nameRegexp = new RegExp("^" + routeOfAdministration, "i");
      let routeadministration = await RouteOfAdministration.find({ routeOfAdministration: nameRegexp });
      const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: routeadministration
	  }
	  res.send(apiResponse);
    } else {
      let routeadministration = await RouteOfAdministration.find({});
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: routeadministration
	  }
      res.send(apiResponse);
    }
  }
);

export { router as showAllRouteOfAdministrationRouter };
