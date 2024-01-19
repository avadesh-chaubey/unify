import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, AppointmentStatus, requirePatientAuth, SlotAvailability, NotFoundError, UserType, AppointmentPaymentStatus, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment';
import { AppointmentConfig } from '../models/appointment-config';
import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper'
import { AppointmentCancelPublisher } from '../events/publishers/appointment-cancel-publisher'
const router = express.Router();

router.post(
  '/api/appointment/cancel',
  requirePatientAuth,
  [
    body('appointmentId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Appointment Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.log('Apppointment Not Found for Id: ', appointmentId);
      throw new NotFoundError();
    }

    const appointmentTrack = {
      stateUpdateTime: new Date(),
      state: AppointmentPaymentStatus.Cancelled,
      appointmentDate: appointment.appointmentDate,
      appointmentSlotId: String(appointment.appointmentSlotId),
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: UserType.Patient,
    }

    const assistantAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: appointment.appointmentStatus,
      appointmentDate: appointment.assistantAppointmentDate,
      appointmentSlotId: appointment.assistantAppointmentSlotId,
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: UserType.Patient,
    }

    const appList = [...appointment.appointmentTimeLine];
    appList.push(appointmentTrack);

    const assistantAppList = [...appointment.assistantAppointmentTimeLine];
    assistantAppList.push(assistantAppointmentTrack);

    appointment.set({
      assistantAppointmentTimeLine: assistantAppList,
      appointmentTimeLine: appList,
      appointmentPaymentStatus: AppointmentPaymentStatus.Cancelled,
    });
    await appointment.save();

    let existingAppointmentConfig = await AppointmentConfig.findOne({
      consultantId: appointment.consultantId,
      appointmentDate: appointment.appointmentDate,
    });

    if (!existingAppointmentConfig) {
      throw new NotFoundError();
    }

    const newList = [...existingAppointmentConfig.availableSlots];
    newList[appointment.appointmentSlotId] = SlotAvailability.Available;
    existingAppointmentConfig.set({
      availableSlots: newList,
      totalBookedSlots: existingAppointmentConfig.totalBookedSlots - 1,
    });
    await existingAppointmentConfig.save();

    ///// Publish New Appointment Message //////////////
    new AppointmentCancelPublisher(natsWrapper.client).publish({
      appointmentId: appointment.id!,
    });

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointment
    };

    res.status(200).send(apiResponse);
  }
);

export { router as cancelAppointmentRouter };
