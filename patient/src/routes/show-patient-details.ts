import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';
import { CaseSheet } from '../models/case-sheet';
import { Patient } from '../models/patient';
import { PatientDocument } from '../models/patient-document';

const router = express.Router();

router.get('/api/patient/showpatientdetails/:patientId',
  requireAuth,
  async (req: Request, res: Response) => {

    const patientId = req.params.patientId;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new BadRequestError("Patient Id is not valid");
    }
    const appointments = await Appointment.find({ customerId: patientId });
    const casesheets = await CaseSheet.find({ patientId: patientId });
    const patientDocuments = await PatientDocument.find({ patientId: patientId });

    const members = await Patient.find({ parentId: patient.parentId });

    const response = {
      appointments,
      casesheets,
      patientDocuments,
      members
    }
	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: response
	}

    res.send(apiResponse);
  });

export { router as showPatientDetailsRouter };
