import express, { Request, Response } from 'express';
import { requirePatientAuth, NotFoundError, BadRequestError, validateRequest, NotAuthorizedError, ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/patient/selfmhrid',
  requirePatientAuth,
  [
    body('mhrId').not().isEmpty().withMessage('MHR ID is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      mhrId
    } = req.body;

    const patient = await Patient.findById(req.currentUser!.id);
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
);

export { router as updateSelfMHRIDRouter };
