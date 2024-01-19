import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment';

const router = express.Router();

router.get(
  '/api/notification/updateagorauid/:appointmentId',
  requireAuth,
  async (req: Request, res: Response) => {

    const appointmentId = req.params.appointmentId;

    let appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new BadRequestError("Appointment not found");
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointment
    };


    res.status(200).send(apiResponse);
  }
);

export { router as showAgoraUidRouter };
