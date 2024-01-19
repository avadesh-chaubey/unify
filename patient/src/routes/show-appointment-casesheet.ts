import express, { Request, Response } from 'express';
import { BadRequestError, ConsultationType, NotFoundError, requireAuth,ApiResponse } from '@unifycaredigital/aem';
import { CaseSheet } from '../models/case-sheet';
import { Appointment } from '../models/appointment-order';
import moment from 'moment';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/api/patient/appointmentcasesheet/:appointmentId',
  requireAuth,
  async (req: Request, res: Response) => {

    const appointmentId = req.params.appointmentId;

    let caseSheet = await CaseSheet.findOne({ appointmentId: appointmentId });
    if (!caseSheet) {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        throw new BadRequestError("Appointment not found!")
      }
      //copy old casesheet
      //find latest Diabologist consultation
      let latestAppointmentId = '';
      let latestAppointmentDate = '';
      let latestAppointmentSlotId = 0;
      const appointmentList = await Appointment.find({
        customerId: appointment.customerId,
        parentId: appointment.parentId,
        consultationType: ConsultationType.Diabetologist
      });
      if (appointmentList && appointmentList.length > 0) {
        for (let i = 0; i < appointmentList.length; i++) {
          console.log('date:  ' + appointmentList[i].appointmentDate + " slot ID " + appointmentList[i].appointmentSlotId);
          if (latestAppointmentId === '' && latestAppointmentDate === '') {
            latestAppointmentId = appointmentList[i].id!;
            latestAppointmentDate = appointmentList[i].appointmentDate;
            latestAppointmentSlotId = appointmentList[i].appointmentSlotId;
            console.log('latest updated first time');
          }
          if (moment(appointmentList[i].appointmentDate).isAfter(moment(latestAppointmentDate)) && appointmentList[i].id != appointmentId) {
            latestAppointmentDate = appointmentList[i].appointmentDate;
            latestAppointmentId = appointmentList[i].id!;
            latestAppointmentSlotId = appointmentList[i].appointmentSlotId;
            console.log('latest updated isAfter');
          } else if (moment(appointmentList[i].appointmentDate).isSame(moment(latestAppointmentDate))) {
            if (appointmentList[i].appointmentSlotId > latestAppointmentSlotId && appointmentList[i].id != appointmentId) {
              latestAppointmentDate = appointmentList[i].appointmentDate;
              latestAppointmentId = appointmentList[i].id!;
              latestAppointmentSlotId = appointmentList[i].appointmentSlotId;
              console.log('latest updated isSame');
            }
          }
        }
      }

      if (latestAppointmentId !== '' && latestAppointmentDate !== '') {
        console.log('found old appointment with date:  ' + latestAppointmentDate + " ID " + latestAppointmentId);
        let oldCaseSheet = await CaseSheet.findOne({ appointmentId: latestAppointmentId });
        if (oldCaseSheet) {
          console.log('found old case sheet with id:  ' + latestAppointmentId);
          caseSheet = CaseSheet.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            appointmentId: appointmentId,
            patientId: appointment.customerId,
            parentId: appointment.parentId,
            chiefComplaints: [...oldCaseSheet.chiefComplaints],
            vitals: oldCaseSheet.vitals,
            medicalHistory: oldCaseSheet.medicalHistory,
            healthRecords: oldCaseSheet.healthRecords,
            notes: oldCaseSheet.notes,
            diagnosis: [...oldCaseSheet.diagnosis],
            medicinePrescription: [...oldCaseSheet.medicinePrescription],
            testPrescription: [...oldCaseSheet.testPrescription],
            followUpChatDays: oldCaseSheet.followUpChatDays,
            adviceInstruction: [...oldCaseSheet.adviceInstruction],
            refferral: oldCaseSheet.refferral,
            lab: oldCaseSheet.lab
          });
          await caseSheet.save();
		  const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: caseSheet
		  }
          res.send(apiResponse);
        } else {
          console.log('case sheet Not found for appointment id:  ' + latestAppointmentId);
          throw new BadRequestError("Case Sheet not found!")
        }
      } else {
        console.log('case sheet Not found for appointment id:  ' + latestAppointmentId);
        throw new BadRequestError("Case Sheet not found!")
      }
    } else {
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: caseSheet
		}
        res.send(apiResponse);
    }

  });

export { router as showAAppointmentCaseSheetRouter };
