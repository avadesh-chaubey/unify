import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, requireAuth, AppointmentStatus, SlotAvailability, UserType, NotFoundError, EmailType, EmailTemplate, EmailDeliveryType, AppointmentUpdateType, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment';
import { AppointmentConfig } from '../models/appointment-config';
import moment from 'moment';
import mongoose from 'mongoose';
import { AppointmentUpdatedPublisher } from '../events/publishers/appointment-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';

const router = express.Router();

const SLICE_DURATION_IN_MIN = 15;
const TOTAL_NUMBER_OF_MIN_IN_AN_HOUR = 60;
const totalNumberOfSlotsInOneHour = (TOTAL_NUMBER_OF_MIN_IN_AN_HOUR / SLICE_DURATION_IN_MIN);
const NUMBER_OF_BUFFER_SLOTS = 4;
const SKIP_CURRENT_SLOT = 1;

router.post(
  '/api/appointment/reschedule',
  requireAuth,
  [
    body('consultantId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Consultant Id must be provided'),
    body('customerId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Patient Id must be provided'),
    body('appointmentId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Appointment Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { appointmentId, consultantId, customerId, appointmentDate, consultationType, appointmentSlotId } = req.body;

    if (!moment(appointmentDate, 'YYYY-MM-DD', true).isValid()) {
      throw new BadRequestError("Date Format should be YYYY-MM-DD");
    }

    //Make sure only future appointments consider as valid. 
    if (!moment(appointmentDate).isSameOrAfter(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      throw new BadRequestError("Cannot make appointment for past date");
    }

    if (moment(appointmentDate).isSame(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      if (appointmentSlotId < ((moment().utcOffset(330).toObject()).hours * totalNumberOfSlotsInOneHour
        + Math.floor(((moment().utcOffset(330).toObject()).minutes) / SLICE_DURATION_IN_MIN))
        + SKIP_CURRENT_SLOT
        + NUMBER_OF_BUFFER_SLOTS) {
        throw new BadRequestError("Cannot make appointment for past time");
      }
    }

    const oldAppointment = await Appointment.findById(appointmentId);
    if (!oldAppointment) {
      console.log('Apppointment Not Found for Id: ', appointmentId);
      throw new NotFoundError();
    }

    let existingAppointmentConfig = await AppointmentConfig.findOne({
      consultantId: consultantId,
      appointmentDate: appointmentDate
    });

    if (!existingAppointmentConfig) {
      throw new NotFoundError();
    }

    //check if requested new slot is available
    if (existingAppointmentConfig.availableSlots[appointmentSlotId] !== SlotAvailability.Available) {
      throw new BadRequestError("Sorry, Requested Appointment Slot Not Available");
    }

    const tempConfig: [SlotAvailability] = [...existingAppointmentConfig.availableSlots];

    tempConfig[appointmentSlotId] = SlotAvailability.Booked;

    existingAppointmentConfig.availableSlots = tempConfig;

    existingAppointmentConfig = await existingAppointmentConfig.save();
    console.log('New AppointmentSlotId: ' + appointmentSlotId + " Marked Booked " + existingAppointmentConfig.availableSlots[appointmentSlotId]);

    const oldAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: oldAppointment.appointmentPaymentStatus,
      appointmentDate: appointmentDate,
      appointmentSlotId: String(appointmentSlotId),
      appointmentRescheduleEnabled: false,
      updatedBy: UserType.Patient,
    }

    const oldAssistantAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: oldAppointment.appointmentStatus,
      appointmentDate: oldAppointment.assistantAppointmentDate,
      appointmentSlotId: String(oldAppointment.assistantAppointmentSlotId),
      appointmentRescheduleEnabled: false,
      updatedBy: UserType.Patient,
    }

    let oldAppointmentConfig = await AppointmentConfig.findOne({
      consultantId: oldAppointment.consultantId,
      appointmentDate: oldAppointment.appointmentDate
    });

    if (oldAppointmentConfig) {

      const tempOldConfig: [SlotAvailability] = [...oldAppointmentConfig.availableSlots];

      tempOldConfig[oldAppointment.appointmentSlotId] = SlotAvailability.Available;

      oldAppointmentConfig.availableSlots = tempOldConfig;

      oldAppointmentConfig = await oldAppointmentConfig.save();
      console.log('Old AppointmentSlotId: ' + oldAppointment.appointmentSlotId + " Marked Available " + oldAppointmentConfig.availableSlots[oldAppointment.appointmentSlotId]);
    }

    const appList = [...oldAppointment.appointmentTimeLine];
    appList.push(oldAppointmentTrack);

    const assistantAppList = [...oldAppointment.assistantAppointmentTimeLine];
    assistantAppList.push(oldAssistantAppointmentTrack);

    oldAppointment.set({
      assistantAppointmentTimeLine: assistantAppList,
      appointmentTimeLine: appList,
      appointmentStatus: oldAppointment.appointmentStatus,
      consultantId: consultantId,
      customerId: customerId,
      creatorId: req.currentUser!.id,
      appointmentSlotId: appointmentSlotId,
      createdBy: req.currentUser!.uty,
      consultationType: consultationType,
      appointmentDate: appointmentDate,
      appointmentCreationTime: new Date(),
      appointmentRescheduleEnabled: false,
    });
    await oldAppointment.save();

    //Send Appointment Update Event
    ///// Publish New Appointment Message //////////////
    new AppointmentUpdatedPublisher(natsWrapper.client).publish({
      appointmentId: oldAppointment.id!,
      consultantId: oldAppointment.consultantId,
      customerId: oldAppointment.customerId,
      creatorId: oldAppointment.creatorId,
      partnerId: oldAppointment.partnerId,
      parentId: oldAppointment.parentId,
      createdBy: oldAppointment.createdBy,
      basePriceInINR: oldAppointment.basePriceInINR,
      consultationType: oldAppointment.consultationType,
      appointmentDate: oldAppointment.appointmentDate,
      appointmentSlotId: oldAppointment.appointmentSlotId,
      appointmentStatus: oldAppointment.appointmentStatus,
      appointmentCreationTime: oldAppointment.appointmentCreationTime,
      orderType: oldAppointment.orderType,
      orderStatus: oldAppointment.orderStatus,
      assistantId: oldAppointment.assistantId,
      assistantAppointmentDate: oldAppointment.assistantAppointmentDate,
      assistantAppointmentSlotId: oldAppointment.assistantAppointmentSlotId,
      assistantConsecutiveBookedSlots: oldAppointment.assistantConsecutiveBookedSlots,
      appointmentRescheduleEnabled: oldAppointment.appointmentRescheduleEnabled,
      appointmentPaymentStatus: oldAppointment.appointmentPaymentStatus,
      arhOrderId: oldAppointment.arhOrderId,
      paymentMode: oldAppointment.paymentMode,
      assistantNotRequired: oldAppointment.assistantNotRequired,
      updatedBy: UserType.Patient,
      updateType: AppointmentUpdateType.Rescheduled
    });

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: oldAppointment
    };

    res.status(201).send(apiResponse);
  }
);

export { router as rescheduleAppointmentRouter };
