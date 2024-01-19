import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  requirePatientAuth,
  AppointmentStatus,
  SlotAvailability,
  NotFoundError,
  AppointmentPaymentStatus,
  OrderStatus,
  OrderType,
  UserType,
  ApiResponse
} from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment';
import { Consultant } from '../models/consultant';
import { AppointmentConfig } from '../models/appointment-config';
import moment from 'moment';
import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

const DEFAULT_EXPIRATION_WINDOW_SECONDS = 20 * 60;

const SLICE_DURATION_IN_MIN = 15;
const TOTAL_NUMBER_OF_MIN_IN_AN_HOUR = 60;
const totalNumberOfSlotsInOneHour = (TOTAL_NUMBER_OF_MIN_IN_AN_HOUR / SLICE_DURATION_IN_MIN);
const NUMBER_OF_BUFFER_SLOTS = 4;
const SKIP_CURRENT_SLOT = 1;

router.post(
  '/api/appointment/add',
  requirePatientAuth,
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
    body('parentId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Parent Id must be provided'),
	body('appointmentType')
      .not()
      .isEmpty()
      .withMessage('Appointment Type must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { consultantId, customerId, parentId, appointmentDate, consultationType, appointmentSlotId, orderType, locationStr, appointmentType } = req.body;
    //Sample locationStr = 'India#Tamil Nadu#Chennai'
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

    let existingAppointmentConfig = await AppointmentConfig.findOne({
      consultantId: consultantId,
      appointmentDate: appointmentDate
    });

    if (!existingAppointmentConfig) {
      throw new NotFoundError();
    }

    //check if requested slot is available
    if (existingAppointmentConfig.availableSlots[appointmentSlotId] !== SlotAvailability.Available) {
      throw new BadRequestError("Sorry, Requested Appointment Slot Not Available");
    }
    const newList = [...existingAppointmentConfig.availableSlots];
    //Requested Slot is available make it as blocked for next 10 min
    newList[appointmentSlotId] = SlotAvailability.Blocked;
    existingAppointmentConfig.set({
      availableSlots: newList,
    });
    await existingAppointmentConfig.save();

    const expiration = new Date();

    expiration.setSeconds(expiration.getSeconds() + DEFAULT_EXPIRATION_WINDOW_SECONDS);

    const id = new mongoose.Types.ObjectId().toHexString();

    const appointmentTrack = {
      stateUpdateTime: new Date(),
      state: AppointmentPaymentStatus.Blocked,
      appointmentDate: appointmentDate,
      appointmentSlotId: appointmentSlotId,
      appointmentRescheduleEnabled: false,
      updatedBy: UserType.Patient,
    }

    const assistantAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: AppointmentStatus.ReadyForDoctorConsultation,
      appointmentDate: appointmentDate,
      appointmentSlotId: appointmentSlotId,
      appointmentRescheduleEnabled: false,
      updatedBy: UserType.Patient,
    }

    let basePriceInINR = existingAppointmentConfig.basePriceInINR;
    const consultant = await Consultant.findById(consultantId);
    if (consultant) {
      basePriceInINR = consultant.consultationChargesInINR;
      if (locationStr && locationStr !== '') {
        for (let i = 0; i < consultant.locationBasedFeeConfig.length; i++) {
          console.log('locationBasedFeeConfig:' + JSON.stringify(consultant.locationBasedFeeConfig[i]));
          console.log('locationStr:' + locationStr + '; doctor loc setting: ' + consultant.locationBasedFeeConfig[i].locationConfig);
          if (String(locationStr).startsWith(consultant.locationBasedFeeConfig[i].locationConfig)) {
            basePriceInINR = consultant.locationBasedFeeConfig[i].flatFees;
            console.log('flatFees:' + consultant.locationBasedFeeConfig[i].flatFees);
          }
        }
      }
    }
    console.log('basePriceInINR:' + basePriceInINR);
    if (orderType && orderType === OrderType.FreeAppointment) {
      basePriceInINR = 0;
    }

    const appointment = Appointment.build({
      id: id,
      consultantId: consultantId,
      customerId: customerId,
      creatorId: req.currentUser!.id,
      basePriceInINR: basePriceInINR,
      appointmentSlotId: appointmentSlotId,
      parentId: parentId,
      createdBy: req.currentUser!.uty,
      consultationType: consultationType,
      appointmentDate: appointmentDate,
      appointmentPaymentStatus: AppointmentPaymentStatus.Blocked,
      appointmentCreationTime: new Date(),
      assistantAppointmentTimeLine: [assistantAppointmentTrack],
      appointmentTimeLine: [appointmentTrack],
      partnerId: req.currentUser!.fid,
      expirationDate: expiration,
      assistantId: 'NA',
      assistantAppointmentDate: 'NA',
      assistantAppointmentSlotId: 'NA',
      assistantConsecutiveBookedSlots: 1,
      appointmentStatus: AppointmentStatus.ReadyForDoctorConsultation,
      appointmentRescheduleEnabled: false,
      orderType: orderType ? orderType : OrderType.PaidAppointment,
      orderStatus: OrderStatus.Created,
      rescheduleSerialNumber: 0,
      assistantNotRequired: true,
	  appointmentType: appointmentType
    });

    // Save the profile to the database
    await appointment.save();

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointment
    };

    res.status(201).send(apiResponse);
    console.log('add-Apppointment called for : ' + appointmentDate + '; slot id: ' + appointmentSlotId);
    console.log('expire at : ' + expiration);


    ///// Publish New Appointment Message //////////////
    new OrderCreatedPublisher(natsWrapper.client).publish({
      productId: appointment.id!,
      expirationDate: appointment.expirationDate,
      priceInINR: appointment.basePriceInINR,
      patientId: appointment.customerId,
      parentId: appointment.parentId,
      status: appointment.orderStatus,
      numberOfRetry: 0,
      orderType: appointment.orderType,
      version: 1
    });
  }
);

export { router as addAppointmentRouter };
