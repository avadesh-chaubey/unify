import express, { Request, Response } from 'express';
import { Patient } from '../models/patient';
import { requirePatientAuth, NotFoundError, ApiResponse } from '@unifycaredigital/aem';

const router = express.Router();

router.get('/api/patient', requirePatientAuth, async (req: Request, res: Response) => {
  const patient = await Patient.findById(req.currentUser!.id);

  if (!patient) {
    throw new NotFoundError();
  }
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: patient
  }

  res.send(apiResponse);
});

export { router as indexPatientRouter };
