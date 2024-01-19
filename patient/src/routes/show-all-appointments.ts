import express, { Request, Response } from 'express';
import { requireCustomerSupportAuth,ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';

const router = express.Router();

router.get('/api/patient/allappointments', requireCustomerSupportAuth, async (req: Request, res: Response) => {
  const appointments = await Appointment.find({});

  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: appointments
  }
  res.send(apiResponse);
});

export { router as showAllAppointmentsRouter };
