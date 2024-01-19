import express, { Request, Response } from 'express';
import { requireCustomerSupportAuth, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';
import moment from 'moment'

const router = express.Router();

router.get('/api/patient/todayappointments', requireCustomerSupportAuth, async (req: Request, res: Response) => {

  const appointmentDate = moment().utcOffset(330).format('YYYY-MM-DD');
  const appointments = await Appointment.find({ appointmentDate: appointmentDate });

  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: appointments
  }
  res.send(apiResponse);
});

export { router as showTodayAppointmentsRouter };
