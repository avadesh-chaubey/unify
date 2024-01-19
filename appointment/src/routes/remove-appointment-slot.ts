import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, requireRosterManagerAuth, SlotAvailability, NotFoundError, ApiResponse } from '@unifycaredigital/aem';
import { AppointmentConfig } from '../models/appointment-config';
import moment from 'moment';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/appointment/removeslots',
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
    const { consultantId, appointmentDate, removeSlotList } = req.body;

    if (!moment(appointmentDate, 'YYYY-MM-DD', true).isValid()) {
      throw new BadRequestError("Date Format should be YYYY-MM-DD");
    }

    //Make sure update only future slots. 
    if (!moment(appointmentDate).isSameOrAfter(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      throw new BadRequestError("Cannot update slot of past date");
    }

    //Make sure only Remove operation is performed 
    let existingAppointmentConfig = await AppointmentConfig.findOne({
      consultantId: consultantId,
      appointmentDate: appointmentDate
    });

    if (!existingAppointmentConfig) {
      throw new NotFoundError();
    }

    //Remove Slots only if it is not booked or bloked
    const newList = [...existingAppointmentConfig.availableSlots];
    for (let i = 0; i < removeSlotList.length; i++) {
      if (newList[removeSlotList[i]] !== SlotAvailability.Blocked
        && newList[removeSlotList[i]] !== SlotAvailability.Booked) {
        newList[removeSlotList[i]] = SlotAvailability.Unavailable;
      }
    }

    existingAppointmentConfig.set({
      availableSlots: newList,
      notPartOfTimeTable: true
    });

    await existingAppointmentConfig.save();

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: "Slot Removed Successfully"
    };

    res.status(200).send(apiResponse);
  }
);

export { router as removeAppointmentSlotRouter };
