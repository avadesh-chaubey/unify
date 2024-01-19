import express, { Request, Response } from 'express';
import { requirePatientAuth, NotFoundError, BadRequestError, validateRequest, NotAuthorizedError, ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/patient/familymembermhrid',
  requirePatientAuth,
  [
    body('patientId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('patientId Id must be provided'),
    body('mhrId').not().isEmpty().withMessage('MHR ID is required'),
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
        if (patient.parentId !== req.currentUser!.id) {
          throw new BadRequestError("Patient Already exist with same MHR ID");
        } else {
		  const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: patient
		   }
          res.status(200).send(apiResponse);
        }
      } else {
        throw new BadRequestError("Patient Already exist with same MHR ID");
      }
    } else {
      patient = await Patient.findById(patientId);
      if (!patient) {
        throw new NotFoundError();
      }
      if (patient.parentId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      } else {
        patient.set({
          mhrId: mhrId
        });
        await patient.save();
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: patient
		}
        res.status(200).send(apiResponse);
      }
    }
  }
);

export { router as updateFamilyMemberMHRIDRouter };
