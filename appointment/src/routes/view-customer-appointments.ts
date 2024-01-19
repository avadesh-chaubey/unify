import express, { Request, Response } from 'express';
import { ApiResponse, requirePatientAuth } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment'

const router = express.Router();

router.get(
  '/api/appointment/view/:customerId',
  requirePatientAuth,
  async (req: Request, res: Response) => {
    const appointments = await Appointment.find({ customerId: req.params.customerId });

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointments
    };

    res.send(apiResponse);
  });

export { router as viewAllAppointmentsRouter };
