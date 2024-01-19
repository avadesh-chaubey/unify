import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, AppointmentStatus, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';
import { CaseSheet } from '../models/case-sheet';

const router = express.Router();

router.post(
    '/api/patient/updatehealthrecordincasesheet',
    requireAuth,
    async (req: Request, res: Response) => {

        const {
            id,
            healthRecords,
        } = req.body;

        let caseSheet = await CaseSheet.findById(id);
        if (!caseSheet) {
            throw new BadRequestError("Invalid casesheet id");
        }

        const appointment = await Appointment.findById(caseSheet.appointmentId);
        if (!appointment) {
            throw new BadRequestError("Appointment Not found for casesheet");
        }

        // if (appointment.appointmentStatus === AppointmentStatus.CompletedWithError
        //     || appointment.appointmentStatus === AppointmentStatus.SuccessfullyCompleted
        //     || appointment.appointmentStatus === AppointmentStatus.Cancelled) {
            caseSheet.set({
                healthRecords: healthRecords,
            });
            caseSheet = await caseSheet.save();
        // }
        const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: caseSheet
		}
        res.send(apiResponse);
    }
);

export { router as updateHealthRecordInCaseSheetRouter };
