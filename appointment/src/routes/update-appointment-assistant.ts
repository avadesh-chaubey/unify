import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  NotFoundError,
  requireConsultantAuth,
  AppointmentStatus,
  UserType,
  AppointmentUpdateType,
  ApiResponse
} from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment';
import moment from 'moment';
import mongoose from 'mongoose';
import { AppointmentUpdatedPublisher } from '../events/publishers/appointment-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const SLICE_DURATION_IN_MIN = 15;
const TOTAL_NUMBER_OF_MIN_IN_AN_HOUR = 60;
const totalNumberOfSlotsInOneHour = (TOTAL_NUMBER_OF_MIN_IN_AN_HOUR / SLICE_DURATION_IN_MIN);
const NUMBER_OF_BUFFER_SLOTS = 0;
const SKIP_CURRENT_SLOT = 1;

router.post(
  '/api/appointment/transfertonewassistant',
  requireConsultantAuth,
  [
    body('appointmentId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Appointment Id must be provided'),
    body('newAssistantId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('New Assistant Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { appointmentId, newAssistantId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.log('Apppointment Not Found for Id: ', appointmentId);
      throw new NotFoundError();
    }

    let updateType = AppointmentUpdateType.AssistantChanged;

    let userType = UserType.PhysicianAssistant;

    const assistantAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: appointment.appointmentStatus,
      appointmentDate: appointment.appointmentDate,
      appointmentSlotId: String(appointment.appointmentSlotId),
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: userType,
    }

    const assistantAppList = [...appointment.assistantAppointmentTimeLine];
    assistantAppList.push(assistantAppointmentTrack);

    appointment.set({
      assistantAppointmentTimeLine: assistantAppList,
      appointmentStatus: appointment.appointmentStatus,
      assistantId: newAssistantId,
      assistantConsecutiveBookedSlots: appointment.assistantConsecutiveBookedSlots,
    });
    // Save the profile to the database
    await appointment.save();


    //Send Appointment Update Event
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
      assistantId: newAssistantId,
      assistantAppointmentDate: appointment.assistantAppointmentDate,
      assistantAppointmentSlotId: appointment.assistantAppointmentSlotId,
      assistantConsecutiveBookedSlots: appointment.assistantConsecutiveBookedSlots,
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      appointmentPaymentStatus: appointment.appointmentPaymentStatus,
      arhOrderId: appointment.arhOrderId,
      paymentMode: appointment.paymentMode,
      assistantNotRequired: appointment.assistantNotRequired,
      updatedBy: userType,
      updateType: updateType
    });

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointment
    };

    res.status(200).send(apiResponse);
  }
);

export { router as updateAppointmentAssistantRouter };
