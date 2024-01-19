import express, { Request, Response } from 'express';
import { requireCustomerSupportAuth,ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';
import { Patient } from '../models/patient';

const router = express.Router();

router.get('/api/patient/allpatients', requireCustomerSupportAuth, async (req: Request, res: Response) => {
  const patients = await Patient.find({});
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: patients
  }
  res.send(apiResponse);
});

export { router as showAllPatientsRouter };
