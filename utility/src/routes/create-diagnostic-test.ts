import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { validateRequest, BadRequestError, ApiResponse } from "@unifycaredigital/aem";
import { DiagnosticTest } from "../model/diagnostic-test";

const router = express.Router();

router.post(
  "/api/utility/diagnostictest",
  [
    body("serviceType").not().isEmpty().withMessage("Service Type is required"),
    body("cost").not().isEmpty().withMessage("Cost is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { serviceType, addCollectionCharges, cost, preCondition, reportWaitingTime, lab } = req.body;

    const currentTest = await DiagnosticTest.findOne({ serviceType: serviceType });
    if (currentTest) {
      return new BadRequestError("Test already exist with same service type");
    }

    const id = new mongoose.Types.ObjectId().toHexString();
    const testType = DiagnosticTest.build({
      id,
      serviceType,
      addCollectionCharges: addCollectionCharges ? addCollectionCharges : false,
      cost,
      preCondition: preCondition ? preCondition : '',
      reportWaitingTime: reportWaitingTime ? reportWaitingTime : '',
      lab: lab ? lab : 'ARH'
    });

    // save TestType object
    await testType.save();

	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: testType
	}

    res.send(apiResponse);
  }
);

export { router as createDiagnosticTestRouter };
