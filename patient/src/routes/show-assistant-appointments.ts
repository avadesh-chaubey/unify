import express, { Request, Response } from 'express';
import { requireConsultantAuth,ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';

const router = express.Router();

router.get('/api/patient/assistant/appointments', requireConsultantAuth, async (req: Request, res: Response) => {

  if (req.query && req.query.date) {
    let date = req.query.date as string;
    const appointments = await Appointment.find({
      assistantId: req.currentUser!.id,
      assistantAppointmentDate: date
    });
	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: appointments
	}
    res.send(apiResponse);
  } else {
    const appointments = await Appointment.find({ assistantId: req.currentUser!.id });
	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: appointments
	}
    res.send(apiResponse);
  }
});

export { router as showAssistantAppointmentsRouter };
