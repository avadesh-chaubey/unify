import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, requireRosterManagerAuth, SlotAvailability, ApiResponse } from '@unifycaredigital/aem';
import { AppointmentConfig } from '../models/appointment-config';
import { Consultant } from '../models/consultant';
import moment from 'moment';
import mongoose from 'mongoose';

const router = express.Router();

const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
const SLICE_DURATION_IN_MIN = 15;
const BASE_PRICE_IN_INR = 500
const TOTAL_NUMBER_OF_MIN_IN_AN_HOUR = 60;
const totalNumberOfSlotsInOneHour = (TOTAL_NUMBER_OF_MIN_IN_AN_HOUR / SLICE_DURATION_IN_MIN);
const NUMBER_OF_BUFFER_SLOTS = 4;
const SKIP_CURRENT_SLOT = 1;

const totalNumberOfSlots = (TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN);

router.post(
  '/api/appointment/updateslots',
  requireRosterManagerAuth,
  [
    body('consultantId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Consultant Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { consultantId, appointmentDate, availableSlotList } = req.body;

    if (!moment(appointmentDate, 'YYYY-MM-DD', true).isValid()) {
      throw new BadRequestError("Date Format should be YYYY-MM-DD");
    }

    //Make sure only future slots marked as available. 
    if (!moment(appointmentDate).isSameOrAfter(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      throw new BadRequestError("Cannot add slot for past date");
    }

    if (availableSlotList.length < totalNumberOfSlots) {
      throw new BadRequestError("Slot List is not Valid");
    }

    let validNextAvailableSlot = 0;

    //Make sure only future slots marked as available. 
    if (moment(appointmentDate).isSame(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      validNextAvailableSlot = ((moment().utcOffset(330).toObject()).hours * totalNumberOfSlotsInOneHour
        + Math.floor(((moment().utcOffset(330).toObject()).minutes) / SLICE_DURATION_IN_MIN))
        + SKIP_CURRENT_SLOT
        + NUMBER_OF_BUFFER_SLOTS;
    }

    //TODO Check if this date is part of Skip List [days like national holiday/other non working days]

    //TODO Check if consultant exists 


    //Make sure only Add operation is performed (No Update or Delete)
    let existingAppointmentConfig = await AppointmentConfig.findOne({
      consultantId: consultantId,
      appointmentDate: appointmentDate,
    });


    if (!existingAppointmentConfig) {
      let totalAvailableSlots = 0;
      //create New one and never mark first slots available (Cron jobs in action) 
      let availableSlots: [SlotAvailability] = [SlotAvailability.Unavailable];
      for (let i = 1; i < totalNumberOfSlots; i++) {
        availableSlots.push(SlotAvailability.Unavailable);
      }
      for (let i = 0; i < availableSlotList.length; i++) {
        if (i >= validNextAvailableSlot) {
          if (availableSlotList[i]) {
            availableSlots[i] = SlotAvailability.Available;
            totalAvailableSlots = totalAvailableSlots + 1
          } else {
            availableSlots[i] = SlotAvailability.Unavailable;
          }
        }
      }
      const id = new mongoose.Types.ObjectId().toHexString();
      let basePriceInINR = BASE_PRICE_IN_INR;
      const consultant = await Consultant.findById(consultantId);
      if (consultant) {
        basePriceInINR = consultant.consultationChargesInINR;
      }
      existingAppointmentConfig = AppointmentConfig.build({
        id,
        consultantId: consultantId,
        lastUpdatedBy: req.currentUser!.id,
        appointmentDate: appointmentDate,
        availableSlots: availableSlots,
        sliceDurationInMin: SLICE_DURATION_IN_MIN,
        partnerId: req.currentUser!.fid,
        basePriceInINR: basePriceInINR,
        notPartOfTimeTable: true,
        isDoctorOnLeave: false,
        totalBookedSlots: 0,
        numberOfSlots: totalAvailableSlots
      });
      await existingAppointmentConfig.save();
    } else {
      let totalAvailableSlots = 0;
      //Add Slots to existing One
      const newList = [...existingAppointmentConfig.availableSlots];
      for (let i = 0; i < availableSlotList.length; i++) {
        if (i >= validNextAvailableSlot) {
          if (availableSlotList[i]) {
            newList[i] = SlotAvailability.Available;
            totalAvailableSlots = totalAvailableSlots + 1
          } else {
            newList[i] = SlotAvailability.Unavailable;
          }
        }
      }
      existingAppointmentConfig.set({
        availableSlots: newList,
        notPartOfTimeTable: true,
        totalBookedSlots: 0,
        numberOfSlots: totalAvailableSlots
      });
      await existingAppointmentConfig.save();
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: "Slots Updated Successfully"
    };

    res.status(200).send(apiResponse);
  }
);

export { router as updateAppointmentSlotRouter };
