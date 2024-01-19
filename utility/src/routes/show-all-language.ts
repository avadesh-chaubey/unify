import express, { Request, Response } from "express";
import { Language } from "../model/language";
import { ApiResponse } from "@unifycaredigital/aem";

const router = express.Router();

router.get(
  "/api/utility/languages",
  async (req: Request, res: Response) => {
    let name: string = "";
    if (req.query && req.query.name) {
      name = (req.query as any).name;
    }

    let languages = await Language.find({});

    if (name != "") {
      const nameRegexp = new RegExp("^" + name, "i");
      languages = await Language.find({ name: nameRegexp });
    }
	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: languages
	}
    res.send(apiResponse);
  }
);

export { router as showAllLanguagesRouter };
