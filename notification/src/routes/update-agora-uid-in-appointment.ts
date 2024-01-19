import express, { Request, Response } from 'express';
import { BadRequestError, validateRequest, requireAuth, UserType, ApiResponse } from '@unifycaredigital/aem';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Appointment } from '../models/appointment';

const router = express.Router();

router.post(
  '/api/notification/updateagorauid',
  requireAuth,
  [
    body('appointmentId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('appointmentId Id must be provided'),
    body('agoraUid').not().isEmpty().withMessage('agoraUid is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const {
      appointmentId,
      agoraUid
    } = req.body;

    let appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new BadRequestError("Appointment id is wrong");
    }
    if (req.currentUser?.uty === UserType.Patient) {
      appointment.patientAgoraUid = agoraUid;
    } else if (req.currentUser?.uty === UserType.PhysicianAssistant) {
      appointment.assistantAgoraId = agoraUid;
    } else {
      appointment.doctorAgoraUid = agoraUid;
    }
    await appointment.save();

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointment
    };

    res.status(200).send(apiResponse);
  }
);

export { router as updateAgoraUidRouter };
