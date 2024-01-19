import express, { Request, Response } from 'express';
import { ApiResponse, BadRequestError, SlotAvailability, UserType } from '@unifycaredigital/aem';
import moment from 'moment';
import { Consultant } from '../models/consultant';
import { AppointmentTimeTable } from '../models/appointment-time-table';
import { AppointmentConfig } from '../models/appointment-config';
import mongoose from 'mongoose';
import { AssistantTimeTable } from '../models/assistant-time-table';
import { PhysicianAssistantRoster, Roster } from '../models/physician-assistant-roster';

const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
const SLICE_DURATION_IN_MIN = 15;
const FUTURE_APPOINTMENT_ALLOWED_IN_DAYS = 31;
const LAST_INDEX_IN_ROSTER_ARRAY = 30;
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;
const SUNDAY = 7;
const totalNumberOfSlots = (TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN);


const router = express.Router();

router.post('/api/appointment/testupdateslot', async (req: Request, res: Response) => {

  const { currDate } = req.body;

  if (!moment(currDate, 'YYYY-MM-DD', true).isValid()) {
    throw new BadRequestError("startDate Format should be YYYY-MM-DD; currDate=" + currDate);
  }

  console.log('testupdateslot Received for date: ' + currDate);

  //Algo
  //1. Calculate nextDate = today + 31 days
  const day = moment(currDate).add(FUTURE_APPOINTMENT_ALLOWED_IN_DAYS, 'days').day();
  const date = moment(currDate).add(FUTURE_APPOINTMENT_ALLOWED_IN_DAYS, 'days').format('YYYY-MM-DD');
  console.log('testupdateslot day: ' + day);
  //2. Get all Consultants  
  const consultantList = await Consultant.find({});
  if (consultantList.length == 0) {
    throw new BadRequestError("consultantList is empty.");
  }
  ////////////////
  const allExistingAppointmentTimeTableArray = await AssistantTimeTable.find({});
  if (allExistingAppointmentTimeTableArray.length == 0) {
    throw new BadRequestError("allExistingAppointmentTimeTableArray is empty.");
  }
  for (let i = 0; i < allExistingAppointmentTimeTableArray.length; i++) {
    console.log('allExistingAppointmentTimeTableArray [' + i + '] = ' + allExistingAppointmentTimeTableArray[i].assistantId);
  }
  ////////////////
  let iAmFirstAssistant = true;
  const existingAssistantRoster = await PhysicianAssistantRoster.findOne({});
  let finalAvailableAssistantList = null;
  if (existingAssistantRoster) {
    finalAvailableAssistantList = [...existingAssistantRoster.availableAssistantList];
  }
  for (let i = 0; i < consultantList.length; i++) {
    //console.log('testupdateslot loop i: ' + i + ' userType= ' + consultantList[i].userType);
    if (consultantList[i].userType === UserType.PhysicianAssistant) {
      console.log('testupdateslot loop i: ' + i + ' userType= ' + consultantList[i].userType + ' consultantId= ' + consultantList[i].id);
      const assistantId = consultantList[i].id;
      const partnerId = consultantList[i].partnerId;
      const existingAppointmentTimeTable = await AssistantTimeTable.findOne({ assistantId: assistantId });
      if (!existingAppointmentTimeTable) {
        console.log('testupdateslot existingAppointmentTimeTable is null' + existingAppointmentTimeTable);
        continue;
      } else {
        console.log('testupdateslot existingAppointmentTimeTable= ' + existingAppointmentTimeTable);
      }
      //3. for each consultant get their timetable of that day 
      let assistantAvailability = {
        shiftFirstSlotId: 28,
        shiftLastSlotId: 88,
        weeklyDayOff: false
      };
      switch (day) {
        case MONDAY: {
          if (existingAppointmentTimeTable.mondayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = existingAppointmentTimeTable.mondayAvailability.shiftFirstSlotId;
          }
          if (existingAppointmentTimeTable.mondayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && existingAppointmentTimeTable.mondayAvailability.shiftLastSlotId >= existingAppointmentTimeTable.mondayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = existingAppointmentTimeTable.mondayAvailability.shiftLastSlotId;
          }
          if (existingAppointmentTimeTable.mondayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = existingAppointmentTimeTable.mondayAvailability.weeklyDayOff
          }
          break;
        }
        case TUESDAY: {
          if (existingAppointmentTimeTable.tuesdayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = existingAppointmentTimeTable.tuesdayAvailability.shiftFirstSlotId;
          }
          if (existingAppointmentTimeTable.tuesdayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && existingAppointmentTimeTable.tuesdayAvailability.shiftLastSlotId >= existingAppointmentTimeTable.tuesdayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = existingAppointmentTimeTable.tuesdayAvailability.shiftLastSlotId;
          }
          if (existingAppointmentTimeTable.tuesdayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = existingAppointmentTimeTable.tuesdayAvailability.weeklyDayOff
          }
          break;
        }
        case WEDNESDAY: {
          if (existingAppointmentTimeTable.wednesdayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = existingAppointmentTimeTable.wednesdayAvailability.shiftFirstSlotId;
          }
          if (existingAppointmentTimeTable.wednesdayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && existingAppointmentTimeTable.wednesdayAvailability.shiftLastSlotId >= existingAppointmentTimeTable.wednesdayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = existingAppointmentTimeTable.wednesdayAvailability.shiftLastSlotId;
          }
          if (existingAppointmentTimeTable.wednesdayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = existingAppointmentTimeTable.wednesdayAvailability.weeklyDayOff
          }
          break;
        }
        case THURSDAY: {
          if (existingAppointmentTimeTable.thursdayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = existingAppointmentTimeTable.thursdayAvailability.shiftFirstSlotId;
          }
          if (existingAppointmentTimeTable.thursdayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && existingAppointmentTimeTable.thursdayAvailability.shiftLastSlotId >= existingAppointmentTimeTable.thursdayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = existingAppointmentTimeTable.thursdayAvailability.shiftLastSlotId;
          }
          if (existingAppointmentTimeTable.thursdayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = existingAppointmentTimeTable.thursdayAvailability.weeklyDayOff
          }
          break;
        }
        case FRIDAY: {
          if (existingAppointmentTimeTable.fridayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = existingAppointmentTimeTable.fridayAvailability.shiftFirstSlotId;
          }
          if (existingAppointmentTimeTable.fridayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && existingAppointmentTimeTable.fridayAvailability.shiftLastSlotId >= existingAppointmentTimeTable.fridayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = existingAppointmentTimeTable.fridayAvailability.shiftLastSlotId;
          }
          if (existingAppointmentTimeTable.fridayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = existingAppointmentTimeTable.fridayAvailability.weeklyDayOff
          }
          break;
        }
        case SATURDAY: {
          if (existingAppointmentTimeTable.saturdayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = existingAppointmentTimeTable.saturdayAvailability.shiftFirstSlotId;
          }
          if (existingAppointmentTimeTable.saturdayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && existingAppointmentTimeTable.saturdayAvailability.shiftLastSlotId >= existingAppointmentTimeTable.saturdayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = existingAppointmentTimeTable.saturdayAvailability.shiftLastSlotId;
          }
          if (existingAppointmentTimeTable.saturdayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = existingAppointmentTimeTable.saturdayAvailability.weeklyDayOff
          }
          break;
        }
        case SUNDAY: {
          if (existingAppointmentTimeTable.sundayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = existingAppointmentTimeTable.sundayAvailability.shiftFirstSlotId;
          }
          if (existingAppointmentTimeTable.sundayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && existingAppointmentTimeTable.sundayAvailability.shiftLastSlotId >= existingAppointmentTimeTable.sundayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = existingAppointmentTimeTable.sundayAvailability.shiftLastSlotId;
          }
          if (existingAppointmentTimeTable.sundayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = existingAppointmentTimeTable.sundayAvailability.weeklyDayOff
          }
          break;
        }
      }


      if (existingAssistantRoster && finalAvailableAssistantList) {

        //console.log('testupdateslot existingAssistantRoster' + finalAvailableAssistantList);
        if (!iAmFirstAssistant) {
          const roster = {
            physicianAssistantId: assistantId!,
            dateInYYYYMMDD: date,
            shiftFirstSlotId: assistantAvailability.shiftFirstSlotId,
            shiftLastSlotId: assistantAvailability.shiftLastSlotId,
            numberOfAppointments: 0,
            onLeaveThisDay: false,
            weeklyDayOff: assistantAvailability.weeklyDayOff,
            sliceDurationInMin: SLICE_DURATION_IN_MIN
          }
          //console.log('testupdateslot !iAmFirstAssistant: ' + newAvailableAssistantList[LAST_INDEX_IN_ROSTER_ARRAY]);
          finalAvailableAssistantList[finalAvailableAssistantList.length - 1].unshift(roster);
          console.log('testupdateslot post update !iAmFirstAssistant finalAvailableAssistantList' + JSON.stringify(finalAvailableAssistantList));
        } else {
          const roster = {
            physicianAssistantId: assistantId!,
            dateInYYYYMMDD: date,
            shiftFirstSlotId: assistantAvailability.shiftFirstSlotId,
            shiftLastSlotId: assistantAvailability.shiftLastSlotId,
            numberOfAppointments: 0,
            onLeaveThisDay: false,
            weeklyDayOff: assistantAvailability.weeklyDayOff,
            sliceDurationInMin: SLICE_DURATION_IN_MIN
          }
          const tempArray = [roster]
          finalAvailableAssistantList.shift();
          finalAvailableAssistantList.push(tempArray);
          iAmFirstAssistant = false;
          console.log('testupdateslot iAmFirstAssistant: ');
        }
      } else {
        console.log('testupdateslot NO existingAssistantRoster !!!');
      }

    } else {
      const consultantId = consultantList[i].id;
      const partnerId = consultantList[i].partnerId;
      const consultationChargesInINR = consultantList[i].consultationChargesInINR;
      const existingAppointmentTimeTable = await AppointmentTimeTable.findOne({ consultantId: consultantId });
      if (!existingAppointmentTimeTable) continue;
      //3. for each consultant get their timetable of that day 
      let availableSlots: [SlotAvailability] = [SlotAvailability.Unavailable];
      for (let j = 1; j < totalNumberOfSlots; j++) {
        availableSlots.push(SlotAvailability.Unavailable);
      }
      let totalAvailableSlots = 0;
      //4. Check Which day is coming on nextDate; day = {Monday, Tuesday ..etc }
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
      //5. apply timetable on nextDate 
      //Check if appointment Config Exist for next day
      let existingAppointmentConfig = await AppointmentConfig.findOne({
        consultantId: consultantId,
        appointmentDate: date
      });
      if (existingAppointmentConfig) {
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
            numberOfSlots: totalAvailableSlots,
            totalBookedSlots: totalBookedSlots
          });
          await existingAppointmentConfig.save();
        }
      } else {
        existingAppointmentConfig = AppointmentConfig.build({
          id: new mongoose.Types.ObjectId().toHexString(),
          consultantId: consultantId!,
          lastUpdatedBy: 'System',
          appointmentDate: date,
          availableSlots: availableSlots,
          sliceDurationInMin: SLICE_DURATION_IN_MIN,
          partnerId: partnerId,
          basePriceInINR: consultationChargesInINR,
          notPartOfTimeTable: false,
          isDoctorOnLeave: false,
          totalBookedSlots: 0,
          numberOfSlots: totalAvailableSlots
        });
        await existingAppointmentConfig.save();
      }
    }
  }
  if (existingAssistantRoster && finalAvailableAssistantList) {
    existingAssistantRoster.availableAssistantList = finalAvailableAssistantList;
    existingAssistantRoster.markModified('availableAssistantList');
    await existingAssistantRoster.save();
    //console.log('testupdateslot final saved data' + JSON.stringify(output));
  }

  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: "test Slot updated Successfully"
  };

  res.status(201).send(apiResponse);
}
);

export { router as testUpdateSlotRouter };
