import express, { Request, Response } from 'express';
import { requirePatientAuth,ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';

const router = express.Router();

router.get('/api/patient/appointmentorder/:id', requirePatientAuth, async (req: Request, res: Response) => {
  const appointmentOrder = await Appointment.findById(req.params.id);
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: appointmentOrder!
  }
  res.send(apiResponse);
});

export { router as showAppoiintmentOrderRouter };
