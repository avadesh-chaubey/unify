
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, requireAuth, NotFoundError, ApiResponse } from '@unifycaredigital/aem';
import { AppointmentConfig } from '../models/appointment-config';
import moment from 'moment';
import mongoose from 'mongoose';


const router = express.Router();

router.post(
  '/api/appointment/cancelleave',
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
    const { consultantId, leaveDate } = req.body;

    if (!moment(leaveDate, 'YYYY-MM-DD', true).isValid()) {
      throw new BadRequestError("Date Format should be YYYY-MM-DD");
    }

    //Make sure only future slots marked as leave. 
    if (!moment(leaveDate).isSameOrAfter(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      throw new BadRequestError("Cannot cancel leave of past date");
    }

    let existingAppointmentConfig = await AppointmentConfig.findOne({
      consultantId: consultantId,
      appointmentDate: leaveDate
    });

    if (!existingAppointmentConfig) {
      console.log('Record not found');
      throw new NotFoundError();
    }

    existingAppointmentConfig.set({
      isDoctorOnLeave: false
    });
    await existingAppointmentConfig.save();

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: "Leave Cancelled Successfully"
    };

    res.status(200).send(apiResponse);
  }
);

export { router as cancelDoctorLeaveRouter };
