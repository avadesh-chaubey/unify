import express, { Request, Response } from 'express';
import { requireAuth, AppointmentStatus, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';

const router = express.Router();

router.get('/api/patient/pastappointments/:patientId', requireAuth, async (req: Request, res: Response) => {
  const appointments = await Appointment.find({
    customerId: req.params.patientId, appointmentStatus: {
      $in: [
        AppointmentStatus.SuccessfullyCompleted,
        AppointmentStatus.CompletedWithError,
        AppointmentStatus.Cancelled
      ]
    }
  });
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: appointments
  }
  res.send(apiResponse);
});

export { router as showPastAppointmentsRouter };