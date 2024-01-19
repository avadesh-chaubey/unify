import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, requireAuth, SlotAvailability, ApiResponse } from '@unifycaredigital/aem';
import { AppointmentConfig } from '../models/appointment-config';
import moment from 'moment';
import mongoose from 'mongoose';
import { Consultant } from '../models/consultant';

const router = express.Router();

const MAX_DAYS_TO_FETCH_APPOINTMENT_SLOTS = 31;
const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
const SLICE_DURATION_IN_MIN = 15;
const BASE_PRICE_IN_INR = 500
const TOTAL_NUMBER_OF_MIN_IN_AN_HOUR = 60;
const totalNumberOfSlotsInOneHour = (TOTAL_NUMBER_OF_MIN_IN_AN_HOUR / SLICE_DURATION_IN_MIN);
const NUMBER_OF_BUFFER_SLOTS = 4;
const SKIP_CURRENT_SLOT = 1;

const totalNumberOfSlots = (TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN);

router.post(
  '/api/appointment/viewslots',
  requireAuth,
  [
    body('consultantId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Consultant Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { consultantId, startDate, stopDate, languages, city } = req.body;

    if (!moment(startDate, 'YYYY-MM-DD', true).isValid()) {
      throw new BadRequestError("startDate Format should be YYYY-MM-DD");
    }

    if (!moment(stopDate, 'YYYY-MM-DD', true).isValid()) {
      throw new BadRequestError("stopDate Format should be YYYY-MM-DD");
    }

    //Make sure view only future slots.
    if (!moment(startDate).isSameOrAfter(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      throw new BadRequestError("Cannot view slot of past date");
    }

    //Make sure view Stop date is after startDate only.
    if (!moment(stopDate).isSameOrAfter(moment(startDate))) {
      throw new BadRequestError("stopDate must be same or after startDate");
    }

    const days = moment(stopDate).diff(moment(startDate), 'days') + 1;

    if (days > MAX_DAYS_TO_FETCH_APPOINTMENT_SLOTS) {
      throw new BadRequestError("Cannot fetch slots for more then 31 days");
    }

    const appointmentSlots = [];
    let date = null;
    //Make sure only future slots marked as available.
    let validNextAvailableSlot = 0;
    for (let j = 0; j < days; j++) {
      date = moment(startDate).add(j, 'days');
      if (moment(date).isSame(moment().utcOffset(330).format('YYYY-MM-DD'))) {
        validNextAvailableSlot = ((moment().utcOffset(330).toObject()).hours * totalNumberOfSlotsInOneHour
          + Math.floor(((moment().utcOffset(330).toObject()).minutes) / SLICE_DURATION_IN_MIN))
          + SKIP_CURRENT_SLOT
          + NUMBER_OF_BUFFER_SLOTS;
      } else {
        validNextAvailableSlot = 0;
      }
      const existingAppointmentConfig = await AppointmentConfig.findOne({
        consultantId: consultantId,
        appointmentDate: date.format('YYYY-MM-DD')
      });
      let slotList: [SlotAvailability] = [SlotAvailability.Unavailable];
      for (let i = 1; i < totalNumberOfSlots; i++) {
        slotList.push(SlotAvailability.Unavailable);
      }
      let isDoctorOnLeave = false;
      if (existingAppointmentConfig) {
        if (existingAppointmentConfig.isDoctorOnLeave) {
          isDoctorOnLeave = existingAppointmentConfig.isDoctorOnLeave;
        }
        for (let i = 0; i < existingAppointmentConfig.availableSlots.length; i++) {
          if (i >= validNextAvailableSlot) {
            slotList[i] = existingAppointmentConfig.availableSlots[i];
          }
        }
      }
	  let availableSlotsCount =slotList.filter(slots => slots == 'available');
	  const doctorData  = await Consultant.findOne({_id : consultantId},{_id : 1,userFirstName :1,userLastName :1,consultationChargesInINR:1,locationBasedFeeConfig:1, about:1,qualificationList: 1,specialization: 1,profileImageName: 1,experinceInYears: 1});

      appointmentSlots.push({ appointmentDate: date.format('YYYY-MM-DD'), isDoctorOnLeave: isDoctorOnLeave, doctorData : doctorData,availableSlotsCount:availableSlotsCount.length, availableSlotsList: slotList });
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointmentSlots
    };

    res.status(200).send(apiResponse);
  }
);

export { router as viewAppointmentSlotRouter };
