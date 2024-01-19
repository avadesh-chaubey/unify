import express, { Request, Response } from 'express';
import { requireConsultantAuth, UserType, AppointmentStatus, requireAuth, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';
import { Patient } from '../models/patient';

const router = express.Router();

router.get('/api/patient/patientbyid/:patientId', requireAuth, async (req: Request, res: Response) => {


  const patientId = req.params.patientId;

  const patient = await Patient.findById(patientId);
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: patient!
  }
  res.send(apiResponse);
});

export { router as showPatientByIdRouter };
