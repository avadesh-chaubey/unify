import express, { Request, Response } from 'express';
import { requirePatientAuth, requireAuth, BadRequestError,ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';

const router = express.Router();

router.get('/api/patient/appointmentbyid/:appointmentId', requireAuth, async (req: Request, res: Response) => {

  const appointmentId = req.params.appointmentId;

  const appointment = await Appointment.findById(appointmentId);
  if (appointment) {
	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: appointment
	}
    res.send(apiResponse);
  } else {
    throw new BadRequestError("Appointment not Found");
  }
});

export { router as showAppointmentByIdRouter };
