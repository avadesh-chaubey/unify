
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, requireAuth, SlotAvailability, AppointmentPaymentStatus, ApiResponse } from '@unifycaredigital/aem';
import { AppointmentConfig } from '../models/appointment-config';
import { Consultant } from '../models/consultant'
import moment from 'moment';
import mongoose from 'mongoose';
import { Appointment } from '../models/appointment';


const router = express.Router();

const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
const SLICE_DURATION_IN_MIN = 15;
const BASE_PRICE_IN_INR = 500

const totalNumberOfSlots = (TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN);

router.post(
  '/api/appointment/markleave',
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
      console.log('Date Format should be YYYY-MM-DD ' + leaveDate);
      throw new BadRequestError("Date Format should be YYYY-MM-DD");
    }

    //Make sure only future slots marked as leave. 
    if (!moment(leaveDate).isAfter(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      console.log('Date Format should be YYYY-MM-DD ' + leaveDate);
      throw new BadRequestError("Cannot mark leave for present or past date");
    }

    const appointmentList = await Appointment.find({
      appointmentDate: leaveDate,
      consultantId: consultantId
    });
    if (appointmentList.length > 0) {
      for (let i = 0; i < appointmentList.length; i++) {
        if (appointmentList[i].appointmentPaymentStatus === AppointmentPaymentStatus.Booked) {
          console.log('Apppointment found for leave date: ' + leaveDate);
          throw new BadRequestError("First reschedule all existing appointments then you can mark leave.");
        }
      }
    }

    let existingAppointmentConfig = await AppointmentConfig.findOne({
      consultantId: consultantId,
      appointmentDate: leaveDate
    });

    if (!existingAppointmentConfig) {
      let availableSlots: [SlotAvailability] = [SlotAvailability.Unavailable];
      for (let i = 1; i < totalNumberOfSlots; i++) {
        availableSlots.push(SlotAvailability.Unavailable);
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
        appointmentDate: leaveDate,
        availableSlots: availableSlots,
        sliceDurationInMin: SLICE_DURATION_IN_MIN,
        partnerId: req.currentUser!.fid,
        basePriceInINR: basePriceInINR,
        notPartOfTimeTable: false,
        isDoctorOnLeave: true,
        numberOfSlots: 0,
        totalBookedSlots: 0
      });
      await existingAppointmentConfig.save();
    } else {

      existingAppointmentConfig.set({
        isDoctorOnLeave: true
      });
      await existingAppointmentConfig.save();
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: "Leave marked Successfully"
    };
    res.status(200).send(apiResponse);
  }
);

export { router as markDoctorLeaveRouter };
