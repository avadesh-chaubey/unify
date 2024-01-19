import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, NotFoundError, ApiResponse } from "@unifycaredigital/aem";
import { Language } from "../model/language";

const router = express.Router();

router.put(
  "/api/utility/language/:id",
  [body("name").not().isEmpty().withMessage("Name is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, shortName } = req.body;

    const id = req.params.id;

    const language = await Language.findById(id);

    if (!language) {
      throw new NotFoundError();
    }

    language.set({
      id,
      name,
      shortName,
    });

    // save language object
    await language.save();

	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: language
	}

    res.send(apiResponse);
  }
);

export { router as updateLanguageRouter };
