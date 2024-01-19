import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, requireRosterManagerAuth, SlotAvailability, AppointmentPaymentStatus, ApiResponse } from '@unifycaredigital/aem';
import { AppointmentConfig } from '../models/appointment-config';
import { Consultant } from '../models/consultant';
import moment from 'moment';
import mongoose from 'mongoose';
import { Appointment } from '../models/appointment';

const router = express.Router();

const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
const SLICE_DURATION_IN_MIN = 15;
const BASE_PRICE_IN_INR = 500;
const totalNumberOfSlots = (TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN);
const TOTAL_NUMBER_OF_MIN_IN_AN_HOUR = 60;
const totalNumberOfSlotsInOneHour = (TOTAL_NUMBER_OF_MIN_IN_AN_HOUR / SLICE_DURATION_IN_MIN);
const NUMBER_OF_BUFFER_SLOTS = 4;
const SKIP_CURRENT_SLOT = 1;

router.post(
  '/api/appointment/addslots',
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

    let validNextAvailableSlot = 0;

    //Make sure only future slots marked as available. 
    if (moment(appointmentDate).isSame(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      validNextAvailableSlot = ((moment().utcOffset(330).toObject()).hours * totalNumberOfSlotsInOneHour
        + Math.floor(((moment().utcOffset(330).toObject()).minutes) / SLICE_DURATION_IN_MIN))
        + SKIP_CURRENT_SLOT
        + NUMBER_OF_BUFFER_SLOTS;
    }

    //Make sure only Add operation is performed (No Update or Delete) 
    let existingAppointmentConfig = await AppointmentConfig.findOne({
      consultantId: consultantId,
      appointmentDate: appointmentDate
    });

    if (!existingAppointmentConfig) {
      let totalAvailableSlots = 0;
      //create New one and never mark first slots available (Cron jobs in action) 
      let availableSlots: [SlotAvailability] = [SlotAvailability.Unavailable];

      for (let i = 1; i < totalNumberOfSlots; i++) {
        availableSlots.push(SlotAvailability.Unavailable);
      }
      for (let i = 0; i < availableSlotList.length; i++) {
        if (availableSlotList[i] >= validNextAvailableSlot) {
          totalAvailableSlots = totalAvailableSlots + 1;
          availableSlots[availableSlotList[i]] = SlotAvailability.Available;
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
      let totalBookedSlots = 0;
      console.log(`validNextAvailableSlot: ` + validNextAvailableSlot);
      //Add Slots to existing One
      let availableSlots: [SlotAvailability] = [SlotAvailability.Unavailable];
      for (let i = 1; i < totalNumberOfSlots; i++) {
        availableSlots.push(SlotAvailability.Unavailable);
      }
      for (let i = 0; i < availableSlotList.length; i++) {
        if (availableSlotList[i] >= validNextAvailableSlot) {
          availableSlots[availableSlotList[i]] = SlotAvailability.Available;
          totalAvailableSlots = totalAvailableSlots + 1;
        }
      }
      const appointmentList = await Appointment.find({
        appointmentDate: appointmentDate,
        consultantId: consultantId
      });

      let bookedSlotsIds = ``;
      let bookedAppointmentCount = 0;
      if (appointmentList.length > 0) {
        for (let i = 0; i < appointmentList.length; i++) {
          if (Number(appointmentList[i].appointmentSlotId) >= validNextAvailableSlot) {
            if (appointmentList[i].appointmentPaymentStatus === AppointmentPaymentStatus.Booked) {
              if (availableSlots[appointmentList[i].appointmentSlotId] === SlotAvailability.Unavailable) {
                console.log(`Apppointment found at ${appointmentList[i].appointmentSlotId} Slot `);
                bookedSlotsIds = bookedSlotsIds + appointmentList[i].appointmentSlotId + `,`;
                bookedAppointmentCount++;
              } else {
                availableSlots[appointmentList[i].appointmentSlotId] = SlotAvailability.Booked;
                totalBookedSlots = totalBookedSlots + 1;
              }
            } else if (appointmentList[i].appointmentPaymentStatus === AppointmentPaymentStatus.Blocked) {
              if (availableSlots[appointmentList[i].appointmentSlotId] === SlotAvailability.Unavailable) {
                console.log(`Apppointment found at ${appointmentList[i].appointmentSlotId} Slot `);
                bookedSlotsIds = bookedSlotsIds + appointmentList[i].appointmentSlotId + `,`;
                bookedAppointmentCount++;
              } else {
                availableSlots[appointmentList[i].appointmentSlotId] = SlotAvailability.Blocked;
                //totalBookedSlots = totalBookedSlots + 1;
              }
            }
         }
        }
      }
      if (bookedAppointmentCount >0){
        throw new BadRequestError(`Cannot remove slots with booked/blocked appointment. Please reschedule and try again. (SlotID:` + bookedSlotsIds + `)`);
      }
      existingAppointmentConfig.set({
        availableSlots: availableSlots,
        totalBookedSlots: totalBookedSlots,
        numberOfSlots: totalAvailableSlots
      });
      await existingAppointmentConfig.save();
    }
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: "Slot Added Successfully"
    };
    res.status(201).send(apiResponse);
  }
);

export { router as addAppointmentSlotRouter };
