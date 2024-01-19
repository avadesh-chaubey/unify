import express, { Request, Response } from 'express';
import { requirePatientAuth, NotFoundError, validateRequest, ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';
import mongoose from 'mongoose';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/patient/familymemberprofiledata',
  requirePatientAuth,
  [
    body('id')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Family Member Id must be provided'),
    body('userFirstName').not().isEmpty().withMessage('User first name is required'),
    body('dateOfBirth').not().isEmpty().withMessage('Date of birth is required'),
    body('gender').not().isEmpty().withMessage('Gender is required'),
    body('relationship').not().isEmpty().withMessage('Relationship is required'),
    // body('languages').not().isEmpty().withMessage('Languages is required'),
    body('motherName').not().isEmpty().withMessage('Mother Name is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      id,
      motherName,
      phoneNumber2,
      profileImageName,
      userFirstName,
      userMiddleName,
      userLastName,
      dateOfBirth,
      gender,
      relationship,
      // languages,
      address,
      address2,
      area,
      city,
      state,
      country,
      pin
    } = req.body;

    const member = await Patient.findById(id);

    if (!member) {
      throw new NotFoundError();
    }

    member.set({
      profileImageName: profileImageName ? profileImageName : member.profileImageName,
      userFirstName: userFirstName,
      userMiddleName: userMiddleName,
      userLastName: userLastName,
      motherName: motherName,
      phoneNumber2: phoneNumber2,
      dateOfBirth: dateOfBirth,
      gender: gender,
      relationship: relationship,
      // languages: languages,
      address: address,
      address2: address2,
      area: area,
      city: city,
      state: state,
      country: country,
      pin: pin,
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

export { router as updateMemberProfileDataRouter };
