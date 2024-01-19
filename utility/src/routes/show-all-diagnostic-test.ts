import { LabType, ApiResponse } from "@unifycaredigital/aem";
import express, { Request, Response } from "express";
import { DiagnosticTest } from "../model/diagnostic-test";

const router = express.Router();

router.get(
  "/api/utility/diagnostictest",
  async (req: Request, res: Response) => {
    let serviceType: string = "";
    let id: string = "";
    let lab;
    if (req.query && req.query.serviceType) {
      serviceType = (req.query as any).serviceType;
    } else if (req.query && req.query.id) {
      id = (req.query as any).id;
    }
    if (req.query && req.query.lab) {
      let temp = (req.query as any).lab;
      if (temp === 'BIO') {
        lab = LabType.BIO;
      } else if (temp === 'ARH') {
        lab = LabType.ARH;
      }
    }
    if (id != "") {
      let diagnosticTest = await DiagnosticTest.findById(id);
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: diagnosticTest!
	  }
      res.send(apiResponse);
    } else if (serviceType != "" && lab !== LabType.ARH && lab !== LabType.BIO) {
      if(serviceType=== "0"){
        const nameRegexp = new RegExp("^[0-9]");
        let diagnosticTest = await DiagnosticTest.find({ serviceType: nameRegexp });
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: diagnosticTest!
		}
        res.send(apiResponse);
      } else {
        const nameRegexp = new RegExp("^" + serviceType, "i");
        let diagnosticTest = await DiagnosticTest.find({ serviceType: nameRegexp });
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: diagnosticTest!
		}
        res.send(apiResponse);
      }

    } else if (serviceType != "" && (lab === LabType.ARH || lab === LabType.BIO)) {
      const nameRegexp = new RegExp("^" + serviceType, "i");
      let diagnosticTest = await DiagnosticTest.find({ serviceType: nameRegexp, lab: lab });
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: diagnosticTest!
	  }
      res.send(apiResponse);
    } else {
      let diagnosticTest = await DiagnosticTest.find({});
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: diagnosticTest!
	  }
      res.send(apiResponse);
    }
  }
);

export { router as showAllDiagnosticTestRouter };
