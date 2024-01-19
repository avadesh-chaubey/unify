import { BadRequestError, ApiResponse } from "@unifycaredigital/aem";
import express, { Request, Response } from "express";
import { State } from "../model/state";

const router = express.Router();

router.get(
  "/api/utility/state",
  async (req: Request, res: Response) => {

	let  apiResponse : ApiResponse = {
        status: 200,
        message: 'Success',
        data: []
    }

    if (req.query && req.query.countryName) {
      const countryName = (req.query as any).countryName
      const countryNameRegExp = new RegExp(countryName, 'i');
      const state = await State.find({ countryName: countryNameRegExp });
      if (!state) {
        throw new BadRequestError('States not found');
      }
      apiResponse = {
        status: 200,
        message: 'Success',
        data: state
      }
    } else {
      const state = await State.find();
      apiResponse = {
        status: 200,
        message: 'Success',
        data: state
      }
    }
    res.send(apiResponse);
  });

export { router as showStateRouter };
