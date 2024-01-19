import express, { Request, Response } from 'express';
import { requirePatientAuth, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';

const router = express.Router();

router.get('/api/patient/appointments/:id', requirePatientAuth, async (req: Request, res: Response) => {
  const appointments = await Appointment.find({
    parentId: req.currentUser!.id,
    customerId: req.params.id
  });
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: appointments
  }
  res.send(apiResponse);
});

export { router as showFamilyMemberAppointmentsRouter };
