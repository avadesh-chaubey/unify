import express, { Request, Response } from 'express';
import { requireConsultantAuth, UserType, AppointmentStatus, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';

const router = express.Router();

router.get('/api/patient/consultant/appointments', requireConsultantAuth, async (req: Request, res: Response) => {


  if (req.currentUser!.uty === UserType.PhysicianAssistant) {
    if (req.query && req.query.date) {
      let date = req.query.date as string;
      const appointments = await Appointment.find({
        assistantId: req.currentUser!.id,
        appointmentDate: date
      });
      if (req.query && req.query.nextDate) {
        let nextDate = req.query.nextDate as string;
        const nextDayCount = await Appointment.countDocuments({
          assistantId: req.currentUser!.id,
          appointmentDate: nextDate,
          appointmentStatus: AppointmentStatus.CaseHistoryPending
        });
        const response = {
          appointments,
          nextDayCount
        }
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: response
		}
        res.send(apiResponse);
      } else {
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: appointments
		}
        res.send(apiResponse);
      }
    } else if (req.query && req.query.name) {
      const nameRegexp = new RegExp("^" + req.query.name, "i");
      const appointments = await Appointment.find({ assistantId: req.currentUser!.id, customerName: nameRegexp });
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
  } else {
    if (req.query && req.query.date) {
      let date = req.query.date as string;
      const appointments = await Appointment.find({
        consultantId: req.currentUser!.id,
        appointmentDate: date
      });
      const response = {
        appointments
      }
	  const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: response
	  }
      res.send(apiResponse);
    } else if (req.query && req.query.name) {
      const nameRegexp = new RegExp("^" + req.query.name, "i");
      const appointments = await Appointment.find({ consultantId: req.currentUser!.id, customerName: nameRegexp });
      const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: appointments
	  }
	  res.send(apiResponse);
    } else {
      const appointments = await Appointment.find({ consultantId: req.currentUser!.id });
      const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: appointments
	  }
	  res.send(apiResponse);
    }
  }

});

export { router as showConsultantAppointmentsRouter };
