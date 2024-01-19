import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireRosterManagerAuth, SlotAvailability, ApiResponse } from '@unifycaredigital/aem';
import { AppointmentTimeTable } from '../models/appointment-time-table';
import moment from 'moment';
import mongoose from 'mongoose';
import { AppointmentConfig } from '../models/appointment-config';
import { Consultant } from '../models/consultant';

const router = express.Router();

const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
const SLICE_DURATION_IN_MIN = 15;
const BASE_PRICE_IN_INR = 500;
const FUTURE_APPOINTMENT_ALLOWED_IN_DAYS = 31;
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;
const SUNDAY = 7;

const totalNumberOfSlots = (TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN);

router.post(
  '/api/appointment/slotstimetable',
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
    const {
      consultantId,
      mondayAvailableSlotList,
      tuesdayAvailableSlotList,
      wednesdayAvailableSlotList,
      thursdayAvailableSlotList,
      fridayAvailableSlotList,
      saturdayAvailableSlotList,
      sundayAvailableSlotList,
    } = req.body;

    let existingAppointmentTimeTable = await AppointmentTimeTable.findOne({ consultantId: consultantId });
    if (existingAppointmentTimeTable) {
      existingAppointmentTimeTable.set({
        mondayAvailableSlotList: mondayAvailableSlotList,
        tuesdayAvailableSlotList: tuesdayAvailableSlotList,
        wednesdayAvailableSlotList: wednesdayAvailableSlotList,
        thursdayAvailableSlotList: thursdayAvailableSlotList,
        fridayAvailableSlotList: fridayAvailableSlotList,
        saturdayAvailableSlotList: saturdayAvailableSlotList,
        sundayAvailableSlotList: sundayAvailableSlotList,
      });
    } else {
      existingAppointmentTimeTable = AppointmentTimeTable.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        consultantId: consultantId,
        partnerId: req.currentUser!.fid,
        lastUpdatedBy: req.currentUser!.id,
        mondayAvailableSlotList: mondayAvailableSlotList,
        tuesdayAvailableSlotList: tuesdayAvailableSlotList,
        wednesdayAvailableSlotList: wednesdayAvailableSlotList,
        thursdayAvailableSlotList: thursdayAvailableSlotList,
        fridayAvailableSlotList: fridayAvailableSlotList,
        saturdayAvailableSlotList: saturdayAvailableSlotList,
        sundayAvailableSlotList: sundayAvailableSlotList,
        sliceDurationInMin: SLICE_DURATION_IN_MIN
      });
    }
    await existingAppointmentTimeTable.save();

    const dayOfWeek = moment().utcOffset(330).day();
    //Effective today time table will be applied for next FUTURE_APPOINTMENT_ALLOWED_IN_DAYS 
    const numberOfDays = FUTURE_APPOINTMENT_ALLOWED_IN_DAYS + dayOfWeek;
    //loop will start from dayOfWeek
    for (let i = dayOfWeek; i < numberOfDays; i++) {
      let availableSlots: [SlotAvailability] = [SlotAvailability.Unavailable];
      for (let j = 1; j < totalNumberOfSlots; j++) {
        availableSlots.push(SlotAvailability.Unavailable);
      }
      const appointmentDate = moment().utcOffset(330).add((i - dayOfWeek), 'days').format('YYYY-MM-DD');
      let day = i <= SUNDAY ? i : i % (SUNDAY);
      if (day == 0) {
        day = 7
      }
      let totalAvailableSlots = 0;
      switch (day) {
        case MONDAY: {
          for (let k = 0; k < existingAppointmentTimeTable.mondayAvailableSlotList.length; k++) {
            availableSlots[(Number(existingAppointmentTimeTable.mondayAvailableSlotList[k]))] = SlotAvailability.Available;
            totalAvailableSlots = totalAvailableSlots + 1;
          }
          break;
        }
        case TUESDAY: {
          for (let k = 0; k < existingAppointmentTimeTable.tuesdayAvailableSlotList.length; k++) {
            availableSlots[(Number(existingAppointmentTimeTable.tuesdayAvailableSlotList[k]))] = SlotAvailability.Available;
            totalAvailableSlots = totalAvailableSlots + 1;
          }
          break;
        }
        case WEDNESDAY: {
          for (let k = 0; k < existingAppointmentTimeTable.wednesdayAvailableSlotList.length; k++) {
            availableSlots[(Number(existingAppointmentTimeTable.wednesdayAvailableSlotList[k]))] = SlotAvailability.Available;
            totalAvailableSlots = totalAvailableSlots + 1;
          }
          break;
        }
        case THURSDAY: {
          for (let k = 0; k < existingAppointmentTimeTable.thursdayAvailableSlotList.length; k++) {
            availableSlots[(Number(existingAppointmentTimeTable.thursdayAvailableSlotList[k]))] = SlotAvailability.Available;
            totalAvailableSlots = totalAvailableSlots + 1;
          }
          break;
        }
        case FRIDAY: {
          for (let k = 0; k < existingAppointmentTimeTable.fridayAvailableSlotList.length; k++) {
            availableSlots[(Number(existingAppointmentTimeTable.fridayAvailableSlotList[k]))] = SlotAvailability.Available;
            totalAvailableSlots = totalAvailableSlots + 1;
          }
          break;
        }
        case SATURDAY: {
          for (let k = 0; k < existingAppointmentTimeTable.saturdayAvailableSlotList.length; k++) {
            availableSlots[(Number(existingAppointmentTimeTable.saturdayAvailableSlotList[k]))] = SlotAvailability.Available;
            totalAvailableSlots = totalAvailableSlots + 1;
          }
          break;
        }
        case SUNDAY: {
          for (let k = 0; k < existingAppointmentTimeTable.sundayAvailableSlotList.length; k++) {
            availableSlots[(Number(existingAppointmentTimeTable.sundayAvailableSlotList[k]))] = SlotAvailability.Available;
            totalAvailableSlots = totalAvailableSlots + 1;
          }
          break;
        }
      }
      //Check if appointment Config Exist for this day
      let existingAppointmentConfig = await AppointmentConfig.findOne({
        consultantId: consultantId,
        appointmentDate: appointmentDate
      });
      if (existingAppointmentConfig) {
        let totalAvailableSlots = 0;
        let totalBookedSlots = 0;
        if (!existingAppointmentConfig.notPartOfTimeTable) {
          // Here we need to preserve the booked or blocked appointments
          //find all booked and blocked slots
          for (let s = 0; s < existingAppointmentConfig.availableSlots.length; s++) {
            if (existingAppointmentConfig.availableSlots[s] === SlotAvailability.Booked
              || existingAppointmentConfig.availableSlots[s] === SlotAvailability.Blocked) {
              availableSlots[s] = existingAppointmentConfig.availableSlots[s];
            }
            if (existingAppointmentConfig.availableSlots[s] === SlotAvailability.Booked) {
              totalBookedSlots = totalBookedSlots + 1;
            }
          }
          existingAppointmentConfig.set({
            availableSlots: availableSlots,
            totalBookedSlots: totalBookedSlots,
            numberOfSlots: totalAvailableSlots
          });
          await existingAppointmentConfig.save();
        }
      } else {
        let basePriceInINR = BASE_PRICE_IN_INR;
        const consultant = await Consultant.findById(consultantId);
        if (consultant) {
          basePriceInINR = consultant.consultationChargesInINR;
        }
        existingAppointmentConfig = AppointmentConfig.build({
          id: new mongoose.Types.ObjectId().toHexString(),
          consultantId: consultantId,
          lastUpdatedBy: req.currentUser!.id,
          appointmentDate: appointmentDate,
          availableSlots: availableSlots,
          sliceDurationInMin: SLICE_DURATION_IN_MIN,
          partnerId: req.currentUser!.fid,
          basePriceInINR: basePriceInINR,
          notPartOfTimeTable: false,
          isDoctorOnLeave: false,
          numberOfSlots: totalAvailableSlots,
          totalBookedSlots: 0
        });
        await existingAppointmentConfig.save();
      }
    }
    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: "Time Table Updated Successfully"
    };
    res.status(200).send(apiResponse);
  }
);

export { router as addAppointmentTimeTableRouter };
