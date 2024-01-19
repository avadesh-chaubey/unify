
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, requireAuth, ApiResponse } from '@unifycaredigital/aem';
import moment from 'moment';
import mongoose from 'mongoose';
import { PhysicianAssistantRoster } from '../models/physician-assistant-roster';

const router = express.Router();

router.post(
  '/api/appointment/cancelassistantleave',
  requireAuth,
  [
    body('assistantId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Assistant Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { assistantId, leaveDate } = req.body;

    if (!moment(leaveDate, 'YYYY-MM-DD', true).isValid()) {
      console.log('Date Format should be YYYY-MM-DD ' + leaveDate);
      throw new BadRequestError("Date Format should be YYYY-MM-DD");
    }

    //Make sure only future slots marked as leave. 
    if (!moment(leaveDate).isSameOrAfter(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      throw new BadRequestError("Cannot cancel leave of past date");
    }

    let dateIndex = 0;
    if (!moment(leaveDate).isSame(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      dateIndex = moment(leaveDate).utcOffset(330)
        .diff(moment().utcOffset(330), 'days') + 1;
    }

    let appointmentDayAssistantList;
    let assistantRoster = await PhysicianAssistantRoster.findOne({});
    if (assistantRoster) {
      appointmentDayAssistantList = [...assistantRoster.availableAssistantList[dateIndex]];
      const index = appointmentDayAssistantList.findIndex(appointmentDayAssistant => appointmentDayAssistant.physicianAssistantId === assistantId);
      if (index != -1) {
        appointmentDayAssistantList[index].onLeaveThisDay = false;
        await assistantRoster.save();
        appointmentDayAssistantList = [...assistantRoster.availableAssistantList[dateIndex]];
      }
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: "Leave Cancelled Successfully"
    };

    res.status(200).send(apiResponse);
  }
);

export { router as cancelAssistantLeaveRouter };
