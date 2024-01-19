import express, { Request, Response } from 'express';
import { requirePatientAuth, AppointmentStatus, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';
import moment from 'moment';

const router = express.Router();

router.get('/api/patient/familyupcomingappointments', requirePatientAuth, async (req: Request, res: Response) => {
  const appointments = await Appointment.find({ parentId: req.currentUser!.id,appointmentStatus: { $in: [ AppointmentStatus.CaseHistoryPending, AppointmentStatus.ReadyForDoctorConsultation ] } });
  console.log("Upcoming appointmynets")
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: appointments
  }

  res.send(apiResponse);
});

export { router as showFamilyUpcomingAppointmentsRouter };