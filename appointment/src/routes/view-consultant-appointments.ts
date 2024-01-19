import express, { Request, Response } from 'express';
import { ApiResponse, requireConsultantAuth } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment'

const router = express.Router();

router.get(
  '/api/appointment/view',
  requireConsultantAuth,
  async (req: Request, res: Response) => {
    const appointments = await Appointment.find({ consultantId: req.currentUser!.id });

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointments
    };

    res.send(apiResponse);
  });

export { router as viewConsultantAppointmentsRouter };
