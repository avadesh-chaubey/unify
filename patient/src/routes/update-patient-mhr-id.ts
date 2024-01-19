import express, { Request, Response } from 'express';
import { requireConsultantAuth, NotFoundError, BadRequestError, validateRequest, ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/patient/patientmhrid',
  requireConsultantAuth,
  [
    body('patientId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('patientId Id must be provided'),
    body('mhrId').not().isEmpty().withMessage('ARH ID is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      patientId,
      mhrId
    } = req.body;

    let patient = await Patient.findOne({ mhrId: mhrId });
    if (patient) {
      if (patient.id === patientId) {
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: patient
		}
        res.send(apiResponse);
      } else {
        throw new BadRequestError("Patient Already exist with same ARH ID");
      }
    } else {
      patient = await Patient.findById(patientId);
      if (!patient) {
        throw new NotFoundError();
      }
      patient.set({
        mhrId: mhrId
      });
      await patient.save();
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: patient
	  }
      res.send(apiResponse);
    }
  }
);

export { router as updatePatientMHRIDRouter };
