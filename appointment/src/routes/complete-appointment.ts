import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, AppointmentStatus, requireConsultantAuth, NotFoundError, AppointmentPaymentStatus, UserType, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment';
import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper'
import { AppointmentCompletedPublisher } from '../events/publishers/appointment-completed-publisher'
const router = express.Router();

router.post(
  '/api/appointment/completed',
  requireConsultantAuth,
  [
    body('appointmentId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Appointment Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { appointmentId, followupConsultationDate, remarks, successfullyCompleted } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.log('Apppointment Not Found for Id: ', appointmentId);
      throw new NotFoundError();
    }

    let appointmentStatus = AppointmentStatus.SuccessfullyCompleted;

    if (!successfullyCompleted) {
      appointmentStatus = AppointmentStatus.CompletedWithError;
    }

    let userType = UserType.PhysicianAssistant;
    if (req.currentUser!.uty !== UserType.PhysicianAssistant) {
      userType = UserType.Doctor;
    }
    const appointmentTrack = {
      stateUpdateTime: new Date(),
      state: appointment.appointmentPaymentStatus,
      appointmentDate: appointment.appointmentDate,
      appointmentSlotId: String(appointment.appointmentSlotId),
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: userType,
    }

    const assistantAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: appointmentStatus,
      appointmentDate: appointment.assistantAppointmentDate,
      appointmentSlotId: String(appointment.assistantAppointmentSlotId),
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: userType,
    }

    const appList = [...appointment.appointmentTimeLine];
    appList.push(appointmentTrack);

    const assistantAppList = [...appointment.assistantAppointmentTimeLine];
    assistantAppList.push(assistantAppointmentTrack);

    appointment.set({
      assistantAppointmentTimeLine: assistantAppList,
      appointmentTimeLine: appList,
      appointmentStatus: appointmentStatus,
      appointmentRescheduleEnabled: false
    });
    await appointment.save();

    ///// Publish New Appointment Message //////////////
    new AppointmentCompletedPublisher(natsWrapper.client).publish({
      appointmentId: appointment.id!,
      successfullyCompleted: successfullyCompleted,
      remarks: remarks,
      followupConsultationDate: followupConsultationDate,
      updatedBy: userType,
    });

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointment
    };

    res.status(200).send(apiResponse);
  }
);

export { router as completedAppointmentRouter };
