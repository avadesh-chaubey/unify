import express, { Request, Response } from 'express';
import { BadRequestError, requireConsultantAuth, AppointmentStatus, ConsultationType, ApiResponse } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { CaseSheet, Vitals } from '../models/case-sheet';
import { Appointment } from '../models/appointment-order';
import moment from 'moment';

const router = express.Router();

router.post(
    '/api/patient/addpatientcasesheet',
    requireConsultantAuth,
    async (req: Request, res: Response) => {

        let {
            appointmentId,
            chiefComplaints,
            vitals,
            medicalHistory,
            healthRecords,
            notes,
            diagnosis,
            medicinePrescription,
            testPrescription,
            followUpChatDays,
            adviceInstruction,
            refferral,
            lab
        } = req.body;


        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            throw new BadRequestError("Appointment Not found case sheet");
        }

        let caseSheet = await CaseSheet.findOne({ appointmentId: appointmentId });
        if (caseSheet) {
            if ((appointment.appointmentStatus === AppointmentStatus.SuccessfullyCompleted) ||
                (appointment.appointmentStatus === AppointmentStatus.CompletedWithError) ||
                (appointment.appointmentStatus === AppointmentStatus.Cancelled)) {

                if (moment().isAfter(moment(appointment.appointmentDate).format('YYYY_MM_DD'))) {
                    throw new BadRequestError("Cannot update casesheet after 7 days of completed/cancelled appointment");
                }
            } else {
                let existingVitals: Vitals = caseSheet.vitals;
                if (vitals && vitals.weigthInKgs && vitals.weigthInKgsDate && vitals.heigthInCms && vitals.heigthInCmsDate) {

                    let heighInMeter = vitals.heigthInCms / 100;
                    let heighInMeterSquare = Math.pow(heighInMeter, 2);
                    existingVitals.bmi = (Number(vitals.weigthInKgs / heighInMeterSquare).toFixed(2)).toString();

                    let weigthInKgsDate = new Date(vitals.weigthInKgsDate);
                    let heightDate = new Date(vitals.heigthInCmsDate);

                    if (weigthInKgsDate > heightDate) {
                        existingVitals.bmiDate = vitals.weigthInKgsDate;
                    } else {
                        existingVitals.bmiDate = vitals.weigthInKgsDate;
                    }

                    existingVitals.weigthInKgs = vitals.weigthInKgs;
                    existingVitals.weigthInKgsDate = vitals.weigthInKgsDate;

                    existingVitals.heigthInCms = vitals.heigthInCms;
                    existingVitals.heigthInCmsDate = vitals.weigthInKgsDate;

                    existingVitals.bloodPressureSystolic = vitals.bloodPressureSystolic;
                    existingVitals.bloodPressureDiastolic = vitals.bloodPressureDiastolic;
                    existingVitals.bloodPressure = vitals.bloodPressure;
                    existingVitals.tempratureInFernite = vitals.tempratureInFernite;
                    existingVitals.bloodSugarLevel = vitals.bloodSugarLevel;
                    existingVitals.waistCircumference = vitals.waistCircumference;
                    existingVitals.pulse = vitals.pulse;
                    existingVitals.bloodPressureSystolicDate = vitals.bloodPressureSystolicDate;
                    existingVitals.bloodPressureDiastolicDate = vitals.bloodPressureDiastolicDate;
                    existingVitals.tempratureInFerniteDate = vitals.tempratureInFerniteDate;
                    existingVitals.waistCircumferenceDate = vitals.waistCircumferenceDate;
                    existingVitals.pulseDate = vitals.pulseDate;
                } else {
                    existingVitals = vitals;
                }
                caseSheet.set({
                    chiefComplaints,
                    vitals: existingVitals,
                    medicalHistory,
                    healthRecords,
                    notes,
                    diagnosis,
                    medicinePrescription,
                    testPrescription,
                    followUpChatDays,
                    adviceInstruction,
                    refferral
                });
                if (lab != '') {
                    caseSheet.lab = lab;
                }
            }
            await caseSheet.save();
        } else {
            caseSheet = CaseSheet.build({
                id: new mongoose.Types.ObjectId().toHexString(),
                appointmentId: appointmentId,
                patientId: appointment.customerId,
                parentId: appointment.parentId,
                chiefComplaints: chiefComplaints,
                vitals: vitals,
                medicalHistory: medicalHistory,
                healthRecords: healthRecords,
                notes: notes,
                diagnosis: diagnosis,
                medicinePrescription: medicinePrescription,
                testPrescription: testPrescription,
                followUpChatDays: followUpChatDays,
                adviceInstruction: adviceInstruction,
                refferral: refferral,
                lab: lab
            });
            if (vitals && vitals.weigthInKgs && vitals.weigthInKgsDate && vitals.heigthInCms && vitals.heigthInCmsDate) {

                let heighInMeter = vitals.heigthInCms / 100;
                let heighInMeterSquare = Math.pow(heighInMeter, 2);

                caseSheet.vitals.bmi = (Number(vitals.weigthInKgs / heighInMeterSquare).toFixed(2)).toString();
                let weigthInKgsDate = new Date(caseSheet.vitals.weigthInKgsDate);
                let heightDate = new Date(caseSheet.vitals.heigthInCmsDate);

                if (weigthInKgsDate > heightDate) {
                    caseSheet.vitals.bmiDate = caseSheet.vitals.weigthInKgsDate;
                } else {
                    caseSheet.vitals.bmiDate = caseSheet.vitals.heigthInCmsDate;
                }
            }
            await caseSheet.save();
        }
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: caseSheet
		  }
        res.send(apiResponse);
    }
);

export { router as addCaseSheetRouter };
