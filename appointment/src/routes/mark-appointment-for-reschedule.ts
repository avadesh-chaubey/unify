import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, AppointmentStatus, AppointmentPaymentStatus, UserType, requireConsultantAuth, NotFoundError, AppointmentUpdateType, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment';
import mongoose from 'mongoose';
import { AppointmentUpdatedPublisher } from '../events/publishers/appointment-updated-publisher';
import { AppointmentRescheduleEnabledPublisher } from '../events/publishers/appointment-reschedule-enabled-publisher';
import { natsWrapper } from '../nats-wrapper';
import moment from 'moment';
const router = express.Router();

const DEFAULT_EXPIRATION_WINDOW_SECONDS = 7 * 24 * 60 * 60; //7 days in sec

router.post(
  '/api/appointment/markreschedule',
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
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.log('Apppointment Not Found for Id: ', appointmentId);
      throw new NotFoundError();
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
      appointmentRescheduleEnabled: true,
      updatedBy: userType,
    }

    const assistantAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: appointment.appointmentStatus,
      appointmentDate: appointment.assistantAppointmentDate,
      appointmentSlotId: String(appointment.assistantAppointmentSlotId),
      appointmentRescheduleEnabled: true,
      updatedBy: userType,
    }

    const appList = [...appointment.appointmentTimeLine];
    appList.push(appointmentTrack);

    const assistantAppList = [...appointment.assistantAppointmentTimeLine];
    assistantAppList.push(assistantAppointmentTrack);

    appointment.set({
      assistantAppointmentTimeLine: assistantAppList,
      appointmentTimeLine: appList,
      rescheduleSerialNumber: appointment.rescheduleSerialNumber + 1,
      appointmentRescheduleEnabled: true,
    });
    await appointment.save();

    let remainginTimeInSec = moment(appointment.appointmentDate).diff(moment(), 'seconds')

    //Assistant might Reschedule Completed Appointment (future scenario)
    if (remainginTimeInSec < 0) {
      remainginTimeInSec = 0;
    }

    const expiration = new Date();

    expiration.setSeconds(expiration.getSeconds() + DEFAULT_EXPIRATION_WINDOW_SECONDS + remainginTimeInSec);

    ///// Publish New Appointment Message //////////////
    new AppointmentRescheduleEnabledPublisher(natsWrapper.client).publish({
      expirationDate: expiration,
      appointmentId: appointment.id!,
      serialNumber: appointment.rescheduleSerialNumber
    });

    ///// Publish New Appointment Message //////////////
    new AppointmentUpdatedPublisher(natsWrapper.client).publish({
      appointmentId: appointment.id!,
      consultantId: appointment.consultantId,
      customerId: appointment.customerId,
      creatorId: appointment.creatorId,
      partnerId: appointment.partnerId,
      parentId: appointment.parentId,
      createdBy: appointment.createdBy,
      basePriceInINR: appointment.basePriceInINR,
      consultationType: appointment.consultationType,
      appointmentDate: appointment.appointmentDate,
      appointmentSlotId: appointment.appointmentSlotId,
      appointmentStatus: appointment.appointmentStatus,
      appointmentCreationTime: appointment.appointmentCreationTime,
      orderType: appointment.orderType,
      orderStatus: appointment.orderStatus,
      assistantId: appointment.assistantId,
      assistantAppointmentDate: appointment.assistantAppointmentDate,
      assistantAppointmentSlotId: appointment.assistantAppointmentSlotId,
      assistantConsecutiveBookedSlots: appointment.assistantConsecutiveBookedSlots,
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      appointmentPaymentStatus: appointment.appointmentPaymentStatus,
      arhOrderId: appointment.arhOrderId,
      paymentMode: appointment.paymentMode,
      assistantNotRequired: appointment.assistantNotRequired,
      updatedBy: userType,
      updateType: AppointmentUpdateType.MarkForReschedule
    });

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointment
    };
    res.status(200).send(appointment);
  }
);

export { router as markForRescheduleAppointmentRouter };
