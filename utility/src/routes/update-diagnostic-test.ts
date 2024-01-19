import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, NotFoundError, ApiResponse } from "@unifycaredigital/aem";
import { DiagnosticTest } from "../model/diagnostic-test";

const router = express.Router();

router.put(
  "/api/utility/diagnostictest/:id",
  [
    body("serviceType").not().isEmpty().withMessage("Service Type is required"),
    body("cost").not().isEmpty().withMessage("Cost is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { serviceType, addCollectionCharges, cost, preCondition, reportWaitingTime, lab } = req.body;

    const id = req.params.id;

    const testType = await DiagnosticTest.findById(id);

    if (!testType) {
      throw new NotFoundError();
    }

    testType.set({
      serviceType,
      cost,
      addCollectionCharges: addCollectionCharges,
      preCondition: preCondition,
      reportWaitingTime: reportWaitingTime,
      lab: lab
    });

    // save testType object
    await testType.save();
	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: testType
	}

    res.send(apiResponse);
  }
);

export { router as updateDiagnosticTestRouter };
