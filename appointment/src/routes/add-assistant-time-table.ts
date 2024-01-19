import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireRosterManagerAuth, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import { AssistantTimeTable } from '../models/assistant-time-table';
import moment from 'moment';
import mongoose from 'mongoose';
import { PhysicianAssistantRoster, Roster } from '../models/physician-assistant-roster';
import { Consultant } from '../models/consultant';

const router = express.Router();
const SLICE_DURATION_IN_MIN = 15;
const FUTURE_APPOINTMENT_ALLOWED_IN_DAYS = 31;
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;
const SUNDAY = 7;
const ASSISTANT_START_SLOT = 1;
const ASSISTANT_END_SLOT = 94;


router.post(
  '/api/appointment/assistanttimetable',
  requireRosterManagerAuth,
  [
    body('assistantId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Consultant Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      assistantId,
      mondayAvailability,   //shiftFirstSlotId, shiftLastSlotId, weeklyDayOff
      tuesdayAvailability,
      wednesdayAvailability,
      thursdayAvailability,
      fridayAvailability,
      saturdayAvailability,
      sundayAvailability,
    } = req.body;

    const assistant = await Consultant.findById(assistantId);
    if (assistant && assistant.emailId === String(process.env.DEFAULT_ASSISTANT_EMAIL_ID)) {
      throw new BadRequestError("Cannot set Roster for Default Diahome Assistant");
    }

    let existingAppointmentTimeTable = await AssistantTimeTable.findOne({ assistantId: assistantId });
    if (existingAppointmentTimeTable) {
      existingAppointmentTimeTable.set({
        mondayAvailability: mondayAvailability,
        tuesdayAvailability: tuesdayAvailability,
        wednesdayAvailability: wednesdayAvailability,
        thursdayAvailability: thursdayAvailability,
        fridayAvailability: fridayAvailability,
        saturdayAvailability: saturdayAvailability,
        sundayAvailability: sundayAvailability,
      });
    } else {
      existingAppointmentTimeTable = AssistantTimeTable.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        assistantId: assistantId,
        partnerId: req.currentUser!.fid,
        mondayAvailability: mondayAvailability,
        tuesdayAvailability: tuesdayAvailability,
        wednesdayAvailability: wednesdayAvailability,
        thursdayAvailability: thursdayAvailability,
        fridayAvailability: fridayAvailability,
        saturdayAvailability: saturdayAvailability,
        sundayAvailability: sundayAvailability,
      });
    }
    await existingAppointmentTimeTable.save();

    const dayOfWeek = moment().utcOffset(330).day();
    console.log("dayOfWeek = " + dayOfWeek);
    //Effective today time table will be applied for next FUTURE_APPOINTMENT_ALLOWED_IN_DAYS 
    const numberOfDays = FUTURE_APPOINTMENT_ALLOWED_IN_DAYS + dayOfWeek;
    //loop will start from dayOfWeek
    let dayCount = 0;
    let newAvailableAssistantList;
    let existingAssistantRoster = await PhysicianAssistantRoster.findById(req.currentUser!.fid);
    if (existingAssistantRoster) {
      newAvailableAssistantList = [...existingAssistantRoster.availableAssistantList];
    }

    for (let i = dayOfWeek; i < numberOfDays; i++) {
      let assistantAvailability = {
        shiftFirstSlotId: ASSISTANT_START_SLOT,
        shiftLastSlotId: ASSISTANT_END_SLOT,
        weeklyDayOff: false
      };
      const dateInYYYYMMDD = moment().utcOffset(330).add((i - dayOfWeek), 'days').format('YYYY-MM-DD');
      let day = i <= SUNDAY ? i : i % (SUNDAY);
      if (day == 0) {
        day = 7
      }
      console.log("dateInYYYYMMDD = " + dateInYYYYMMDD);
      switch (day) {
        case MONDAY: {
          if (mondayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = mondayAvailability.shiftFirstSlotId;
          }
          if (mondayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && mondayAvailability.shiftLastSlotId >= mondayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = mondayAvailability.shiftLastSlotId;
          }
          if (mondayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = mondayAvailability.weeklyDayOff
          }
          break;
        }
        case TUESDAY: {
          if (tuesdayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = tuesdayAvailability.shiftFirstSlotId;
          }
          if (tuesdayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && tuesdayAvailability.shiftLastSlotId >= tuesdayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = tuesdayAvailability.shiftLastSlotId;
          }
          if (tuesdayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = tuesdayAvailability.weeklyDayOff
          }
          break;
        }
        case WEDNESDAY: {
          if (wednesdayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = wednesdayAvailability.shiftFirstSlotId;
          }
          if (wednesdayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && wednesdayAvailability.shiftLastSlotId >= wednesdayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = wednesdayAvailability.shiftLastSlotId;
          }
          if (wednesdayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = wednesdayAvailability.weeklyDayOff
          }
          break;
        }
        case THURSDAY: {
          if (thursdayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = thursdayAvailability.shiftFirstSlotId;
          }
          if (thursdayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && thursdayAvailability.shiftLastSlotId >= thursdayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = thursdayAvailability.shiftLastSlotId;
          }
          if (thursdayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = thursdayAvailability.weeklyDayOff
          }
          break;
        }
        case FRIDAY: {
          if (fridayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = fridayAvailability.shiftFirstSlotId;
          }
          if (fridayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && fridayAvailability.shiftLastSlotId >= fridayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = fridayAvailability.shiftLastSlotId;
          }
          if (fridayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = fridayAvailability.weeklyDayOff
          }
          break;
        }
        case SATURDAY: {
          if (saturdayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = saturdayAvailability.shiftFirstSlotId;
          }
          if (saturdayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && saturdayAvailability.shiftLastSlotId >= saturdayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = saturdayAvailability.shiftLastSlotId;
          }
          if (saturdayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = saturdayAvailability.weeklyDayOff
          }
          break;
        }
        case SUNDAY: {
          if (sundayAvailability.shiftFirstSlotId > assistantAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftFirstSlotId = sundayAvailability.shiftFirstSlotId;
          }
          if (sundayAvailability.shiftLastSlotId < assistantAvailability.shiftLastSlotId
            && sundayAvailability.shiftLastSlotId >= sundayAvailability.shiftFirstSlotId) {
            assistantAvailability.shiftLastSlotId = sundayAvailability.shiftLastSlotId;
          }
          if (sundayAvailability.weeklyDayOff) {
            assistantAvailability.weeklyDayOff = sundayAvailability.weeklyDayOff
          }
          break;
        }
      }
      // if (assistantAvailability.weeklyDayOff) {
      //   continue;
      // }
      const existingAssistantRoster = await PhysicianAssistantRoster.findById(req.currentUser!.fid);
      if (existingAssistantRoster && newAvailableAssistantList) {
        const assiatantSearch = (element: Roster) => element.physicianAssistantId === assistantId;
        let index = -1;
        console.log('dayCount ' + dayCount + ' Date ' + dateInYYYYMMDD)
        if (newAvailableAssistantList[dayCount]) {
          index = newAvailableAssistantList[dayCount].findIndex(assiatantSearch);

          if (index >= 0) {
            newAvailableAssistantList[dayCount][index].shiftFirstSlotId = assistantAvailability.shiftFirstSlotId;
            newAvailableAssistantList[dayCount][index].shiftLastSlotId = assistantAvailability.shiftLastSlotId;
            newAvailableAssistantList[dayCount][index].weeklyDayOff = assistantAvailability.weeklyDayOff;
          } else {
            const roster = {
              physicianAssistantId: assistantId,
              dateInYYYYMMDD: dateInYYYYMMDD,
              shiftFirstSlotId: assistantAvailability.shiftFirstSlotId,
              shiftLastSlotId: assistantAvailability.shiftLastSlotId,
              numberOfAppointments: 0,
              onLeaveThisDay: false,
              weeklyDayOff: assistantAvailability.weeklyDayOff,
              sliceDurationInMin: SLICE_DURATION_IN_MIN
            }
            newAvailableAssistantList[dayCount].unshift(roster);
          }
        } else {
          const roster = {
            physicianAssistantId: assistantId,
            dateInYYYYMMDD: dateInYYYYMMDD,
            shiftFirstSlotId: assistantAvailability.shiftFirstSlotId,
            shiftLastSlotId: assistantAvailability.shiftLastSlotId,
            numberOfAppointments: 0,
            onLeaveThisDay: false,
            weeklyDayOff: assistantAvailability.weeklyDayOff,
            sliceDurationInMin: SLICE_DURATION_IN_MIN
          }
          const tempArray = [roster]
          newAvailableAssistantList.push(tempArray);
        }
        // console.log(`------------ newAvailableAssistantList ${dayCount} ----------`);
        // for (let u = 0; u <= dayCount; u++) {
        //   for (let t = 0; t < newAvailableAssistantList[u].length; t++) {
        //     console.log(newAvailableAssistantList[u][t]);
        //   }
        // }

        existingAssistantRoster.availableAssistantList = newAvailableAssistantList

        await existingAssistantRoster.save();
        newAvailableAssistantList = [...existingAssistantRoster.availableAssistantList];

      } else {

        const roster = {
          physicianAssistantId: assistantId,
          dateInYYYYMMDD: dateInYYYYMMDD,
          shiftFirstSlotId: assistantAvailability.shiftFirstSlotId,
          shiftLastSlotId: assistantAvailability.shiftLastSlotId,
          numberOfAppointments: 0,
          onLeaveThisDay: false,
          weeklyDayOff: assistantAvailability.weeklyDayOff,
          sliceDurationInMin: SLICE_DURATION_IN_MIN
        }

        let availableAssistantList = [
          [roster]
        ];
        const existingAssistantRoster2 = PhysicianAssistantRoster.build({
          id: req.currentUser!.fid,
          availableAssistantList: availableAssistantList,
        })
        await existingAssistantRoster2.save();
        newAvailableAssistantList = [...existingAssistantRoster2.availableAssistantList];
      }
      dayCount = dayCount + 1;
    }
    // existingAssistantRoster = await PhysicianAssistantRoster.findById(req.currentUser!.fid);
    // if (existingAssistantRoster) {
    //   console.log(`------------ saved Assistant Availability List ----------`);
    //   for (let t = 0; t < existingAssistantRoster.availableAssistantList.length; t++) {
    //     console.log(existingAssistantRoster.availableAssistantList[t]);
    //   }
    // }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: "Time Table Updated Successfully"
    };

    res.status(200).send(apiResponse);
  }
);

export { router as addAssistantTimeTableRouter };
