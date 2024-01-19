import express, { Request, Response } from "express";
import { NotFoundError, requireAuth, ApiResponse } from "@unifycaredigital/aem";
import { DiagnosticTest } from "../model/diagnostic-test";

const router = express.Router();

router.get(
  "/api/utility/deletediagnostictest/:id",
  requireAuth,
  async (req: Request, res: Response) => {

    const id = req.params.id;

    const testType = await DiagnosticTest.findByIdAndDelete(id);

    if (!testType) {
      throw new NotFoundError();
    }

	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: testType
	}

    res.send(apiResponse);
  }
);

export { router as deleteDiagnosticTestRouter };
