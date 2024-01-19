import express, { Request, Response } from 'express';
import { requirePatientAuth, NotFoundError, validateRequest, ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/patient/profileImage',
  requirePatientAuth,
  [
    body('profileImageName').not().isEmpty().withMessage('Profile Image Name is required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      profileImageName
    } = req.body;

    const patient = await Patient.findById(req.currentUser!.id);

    if (!patient) {
      throw new NotFoundError();
    }

    patient.set({
      profileImageName: profileImageName
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

export { router as updateSelfProfileImageRouter };
