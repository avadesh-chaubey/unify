import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  NotFoundError,
  requireConsultantAuth,
  AppointmentStatus,
  UserType,
  AppointmentUpdateType,
  ApiResponse
} from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment';
import moment from 'moment';
import mongoose from 'mongoose';
import { AppointmentUpdatedPublisher } from '../events/publishers/appointment-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const SLICE_DURATION_IN_MIN = 15;
const TOTAL_NUMBER_OF_MIN_IN_AN_HOUR = 60;
const totalNumberOfSlotsInOneHour = (TOTAL_NUMBER_OF_MIN_IN_AN_HOUR / SLICE_DURATION_IN_MIN);
const NUMBER_OF_BUFFER_SLOTS = 0;
const SKIP_CURRENT_SLOT = 1;

router.post(
  '/api/appointment/updateassistantappointment',
  requireConsultantAuth,
  [
    body('appointmentId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Appointment Id must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { appointmentId, appointmentDateAndTime, consecutiveBookedSlots, newAppointmentState } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.log('Apppointment Not Found for Id: ', appointmentId);
      throw new NotFoundError();
    }
    if (appointmentDateAndTime) {

      if (!moment(appointmentDateAndTime, 'DD.MM.YYYY HH:mm', true).isValid()) {
        throw new BadRequestError("Date Format should be DD.MM.YYYY HH:mm");
      }

      const appointmentSlotId = appointment.appointmentSlotId;


      let minutes = ((appointmentSlotId % 4) * 15);

      let timee = Math.floor(appointmentSlotId / 4);

      let minutesStr = "";
      if (minutes < 10) {
        minutesStr = minutesStr.concat(minutes.toString(), "0");
      } else {
        minutesStr = minutes.toString();
      }
      const timeStr = appointment.appointmentDate + " " + timee + ":" + minutesStr;

      console.log('timeStr ' + timeStr)

      let time = moment(appointmentDateAndTime, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm');

      console.log((moment(timeStr, 'YYYY-MM-DD HH:mm')).diff(moment(time), 'minutes'));

      //console.log(" Call Time With IST" + moment(timeStr, 'YYYY-MM-DD HH:mm').utcOffset(330).format('YYYY-MM-DD HH:mm'));
      console.log(" Call Time Without IST" + moment(timeStr, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm'));

      //console.log(" With IST" + moment(appointmentDateAndTime, 'DD.MM.YYYY HH:mm').utcOffset(330).format('YYYY-MM-DD HH:mm'));
      console.log(" Without IST" + moment(appointmentDateAndTime, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm'));


      if ((moment(timeStr, 'YYYY-MM-DD HH:mm')).diff(moment(time), 'minutes') < SLICE_DURATION_IN_MIN) {
        throw new BadRequestError(`Call Date must be ${SLICE_DURATION_IN_MIN} min before appointment time`);
      }

      if (!moment(time).isAfter(moment().utcOffset(330).format('YYYY-MM-DD HH:mm'))) {
        throw new BadRequestError(" Call Time must be a future time ");
      }
    }

    let updateType = AppointmentUpdateType.AssistantTimeUpdate;
    if (newAppointmentState) {
      if (newAppointmentState === AppointmentStatus.ReadyForDoctorConsultation) {
        updateType = AppointmentUpdateType.ReadyForDoctorConsultation;
      }
    }

    let userType = UserType.PhysicianAssistant;
    if (req.currentUser!.uty !== UserType.PhysicianAssistant) {
      userType = UserType.Doctor;
    }

    const assistantAppointmentTrack = {
      stateUpdateTime: new Date(),
      state: newAppointmentState ? newAppointmentState : appointment.appointmentStatus,
      appointmentDate: appointmentDateAndTime ? moment(appointmentDateAndTime, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD') : appointment.appointmentDate,
      appointmentSlotId: appointmentDateAndTime ? moment(appointmentDateAndTime, 'DD.MM.YYYY HH:mm').format('HH:mm') : String(appointment.appointmentSlotId),
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      updatedBy: userType,
    }

    const assistantAppList = [...appointment.assistantAppointmentTimeLine];
    assistantAppList.push(assistantAppointmentTrack);

    appointment.set({
      assistantAppointmentTimeLine: assistantAppList,
      assistantAppointmentDate: appointmentDateAndTime ? moment(appointmentDateAndTime, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD') : appointment.appointmentDate,
      assistantAppointmentSlotId: appointmentDateAndTime ? moment(appointmentDateAndTime, 'DD.MM.YYYY HH:mm').format('HH:mm') : String(appointment.appointmentSlotId),
      appointmentStatus: newAppointmentState ? newAppointmentState : appointment.appointmentStatus,
      assistantConsecutiveBookedSlots: consecutiveBookedSlots ? consecutiveBookedSlots : appointment.assistantConsecutiveBookedSlots,
    });
    // Save the profile to the database
    await appointment.save();


    //Send Appointment Update Event
    ///// Publish New Appointment Message //////////////
    new AppointmentUpdatedPublisher(natsWrapper.client).publish({
      appointmentId: appointment.id!,
      consultantId: appointment.consultantId,
      customerId: appointment.customerId,
      creatorId: appointment.creatorId,
      partnerId: appointment.partnerId,
      parentId: appointment.parentId,
      createdBy: appointment.createdBy,
      basePriceInINR: appointment.basePriceInINR,
      consultationType: appointment.consultationType,
      appointmentDate: appointment.appointmentDate,
      appointmentSlotId: appointment.appointmentSlotId,
      appointmentStatus: appointment.appointmentStatus,
      appointmentCreationTime: appointment.appointmentCreationTime,
      orderType: appointment.orderType,
      orderStatus: appointment.orderStatus,
      assistantId: appointment.assistantId,
      assistantAppointmentDate: appointment.assistantAppointmentDate,
      assistantAppointmentSlotId: appointment.assistantAppointmentSlotId,
      assistantConsecutiveBookedSlots: appointment.assistantConsecutiveBookedSlots,
      appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
      appointmentPaymentStatus: appointment.appointmentPaymentStatus,
      arhOrderId: appointment.arhOrderId,
      paymentMode: appointment.paymentMode,
      assistantNotRequired: appointment.assistantNotRequired,
      updatedBy: userType,
      updateType: updateType
    });

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: appointment
    };

    res.status(200).send(apiResponse);
  }
);

export { router as updateAssistantAppointmentRouter };
