import express, { Request, Response } from 'express';
import { requirePatientAuth, NotFoundError, validateRequest, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { Patient } from '../models/patient';
import { body } from 'express-validator';
import { Consultant } from '../models/consultant';

const router = express.Router();

router.post(
  '/api/patient/selfprofiledata',
  requirePatientAuth,
  [
    body('userFirstName').not().isEmpty().withMessage('User first name is required'),
    body('dateOfBirth').not().isEmpty().withMessage('Date of birth is required'),
    body('gender').not().isEmpty().withMessage('Gender is required'),
    body('emailId').not().isEmpty().withMessage('Email Id is required'),
    // body('languages').not().isEmpty().withMessage('Languages is required'),
    body('motherName').not().isEmpty().withMessage('Mother Name is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      motherName,
      phoneNumber2,
      profileImageName,
      userFirstName,
      userMiddleName,
      userLastName,
      dateOfBirth,
      gender,
      emailId,
      languages,
      address,
      address2,
      area,
      city,
      state,
      country,
      pin
    } = req.body;

    const patient = await Patient.findById(req.currentUser!.id);

    if (!patient) {
      throw new NotFoundError();
    }

    if (patient.emailId !== emailId) {
      const existingPatient = await Patient.findOne({ emailId: emailId })
      if (existingPatient) {
        throw new BadRequestError("Email Id already in use");
      }

      const existingConsultant = await Consultant.findOne({ emailId: emailId })
      if (existingConsultant) {
        throw new BadRequestError("Email Id already in use");
      }
    }

    patient.set({
      profileImageName: profileImageName ? profileImageName : patient.profileImageName,
      userFirstName: userFirstName,
      userMiddleName: userMiddleName,
      userLastName: userLastName,
      motherName: motherName,
      dateOfBirth: dateOfBirth,
      gender: gender,
      phoneNumber2: phoneNumber2,
      emailId: emailId,
      languages: languages ? languages : ['Hindi'],
      address: address,
      address2: address2,
      city: city,
      area: area,
      state: state,
      coutnry: country,
      pin: pin,
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

export { router as updateSelfProfileDataRouter };
