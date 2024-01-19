import express, { Request, Response } from 'express';
import { requireAuth, UserStatus, UserType } from '@unifycaredigital/aem';
import { PartnerEmployee } from '../models/partner-employee';
import { AppointmentConfig } from '../models/appointment-config';

const APPOIINTMENT_SLICE_DURATION_IN_MIN = 15;
const NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR = 60 / APPOIINTMENT_SLICE_DURATION_IN_MIN;

const router = express.Router();

function getKeyByValue(object: any, value: any) {
	return Object.keys(object).find(key => object[key] === value);
}

router.get('/api/appointment/doctors', requireAuth, async (req: Request, res: Response) => {
	var doctors: any = [];
	let organizationUID = req.query.organizationUID as any;
	let specialityUID = req.query.specialityUID as any;
	let earliestAvailable = req.query.earliestAvailable as any;
	let mostExperienced = req.query.mostExperienced as any;
	if (req.query && req.query.organizationUID && req.query.specialityUID) {
		doctors = await PartnerEmployee.find({ organizationUID: organizationUID, specialityUID: specialityUID });
		for (let i = 0; i < doctors.length; i++) {
			const appointment = await AppointmentConfig.findOne({ consultantId: doctors[i]._id })
			if(appointment){
				let avaialble = getKeyByValue(appointment!.availableSlots, "available") as any
				const appointmentStartTime =appointment!.appointmentDate
											+ "T"+ String(Math.floor(avaialble / NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR))
											+ ":"+ String((avaialble % NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR) * APPOIINTMENT_SLICE_DURATION_IN_MIN)+":00.000Z";
				doctors[i].nextAvailableSlot = appointmentStartTime as any;
			}
		}
	}
	else {
		doctors = await PartnerEmployee.find({ organizationUID: organizationUID });
		for (let i = 0; i < doctors.length; i++) {
			const appointment = await AppointmentConfig.findOne({ consultantId: doctors[i]._id })
			if(appointment){
				let avaialble = getKeyByValue(appointment!.availableSlots, "available") as any
				const appointmentStartTime = appointment!.appointmentDate
												+ "T"+ String(Math.floor(avaialble / NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR))
												+ ":"+ String((avaialble % NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR) * APPOIINTMENT_SLICE_DURATION_IN_MIN)+":00.000Z";
				doctors[i].nextAvailableSlot = appointmentStartTime as any;
			}
		}
	}
	if (earliestAvailable) {
		doctors = doctors.sort((n1: any, n2: any) => {
			if (n1.nextAvailableSlot > n2.nextAvailableSlot) {
				return 1;
			}
			if (n1.nextAvailableSlot < n2.nextAvailableSlot) {
				return -1;
			}
			return 0;
		});
	}
	if (mostExperienced) {
		doctors = doctors.sort((n1: any, n2: any) => {
			return n2.experinceInYears - n1.experinceInYears
		})
	}
	const apiResponse = {
		status: 200,
		message: 'Success',
		data: doctors
	};
	res.send(apiResponse)

});

export { router as showAllDoctorsRouter };
