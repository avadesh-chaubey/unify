import express, { Request, Response } from 'express';
import { requireConsultantAuth, ApiResponse, OrderStatus } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';

const router = express.Router();

router.get('/api/patient/consultant/stats', requireConsultantAuth, async (req: Request, res: Response) => {

	const consultantId = req.query.consultantId as any;
	const appointmentDate = req.query.appointmentDate as any;

	const opdVideo = await Appointment.find({ consultantId: req.currentUser!.id, appointmentDate: appointmentDate, orderStatus: OrderStatus.Paid, appointmentType: "Video" });

	const opdPhysical = await Appointment.find({ consultantId: req.currentUser!.id, appointmentDate: appointmentDate, orderStatus: OrderStatus.Paid, appointmentType: "Physical" })

	const opdCount = await Appointment.find({ consultantId: req.currentUser!.id, appointmentDate: appointmentDate, orderStatus: OrderStatus.Paid })


	const apiResponse: ApiResponse = {
		status: 200,
		message: 'Success',
		data: {
			physicalOpdCount: opdPhysical.length,
			videoOpdCount: opdVideo.length,
			consultRequests: 0,
			readyForDischarge: 0,
			opdCount: opdCount.length,
			ipdCount : 0
		}
	}
	res.send(apiResponse)

});

export { router as getConsultantStatsRouter };
