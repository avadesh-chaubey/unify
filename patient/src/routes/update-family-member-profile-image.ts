import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requirePatientAuth, validateRequest, NotFoundError, ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/patient/familymemberImage',
  requirePatientAuth,
  [
    body('memberId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Family Member Id must be provided'),
    body('profileImageName').not().isEmpty().withMessage('Profile Image Name is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      memberId,
      profileImageName,
    } = req.body;

    const member = await Patient.findById(memberId);

    if (!member) {
      throw new NotFoundError();
    }

    member.set({
      profileImageName: profileImageName
    });
    await member.save();

	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: member
	}

    res.send(apiResponse);
  }
);

export { router as updateMemberProfileImageRouter };
