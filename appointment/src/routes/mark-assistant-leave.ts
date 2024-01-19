
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError, requireAuth, AppointmentPaymentStatus, UserType, AppointmentUpdateType, AppointmentStatus, ApiResponse } from '@unifycaredigital/aem';
import moment from 'moment';
import mongoose from 'mongoose';
import { Appointment } from '../models/appointment';
import { PhysicianAssistantRoster } from '../models/physician-assistant-roster';
import { AppointmentUpdatedPublisher } from '../events/publishers/appointment-updated-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.post(
  '/api/appointment/markassistantleave',
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
      throw new BadRequestError("Cannot mark leave for past date");
    }

    if (moment(leaveDate).isAfter(moment().utcOffset(330).add(30, 'days').format('YYYY-MM-DD'))) {
      throw new BadRequestError("Cannot mark leave for more then 30 days in advance");
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
        appointmentDayAssistantList[index].onLeaveThisDay = true;
        await assistantRoster.save();
        appointmentDayAssistantList = [...assistantRoster.availableAssistantList[dateIndex]];
      }
    }

    const appointmentList = await Appointment.find({
      appointmentDate: leaveDate,
      assistantId: assistantId
    });

    if (appointmentList.length > 0) {
      if (assistantRoster) {
        for (let z = 0; z < appointmentList.length; z++) {

          if (appointmentList[z].appointmentStatus === AppointmentStatus.SuccessfullyCompleted
            || appointmentList[z].appointmentStatus === AppointmentStatus.CompletedWithError
            || appointmentList[z].appointmentStatus === AppointmentStatus.Cancelled) continue;

          let appointmentUpdatedWithNewAssistant = false;
          let newAssistantId = 'NA';
          let iAmBackupAssistant = 'NA';
          let indexOfBackupAssistant = -1;

          if (appointmentDayAssistantList && appointmentDayAssistantList.length > 0) {
            console.log('--------- Befor Allocation ------- ');
            console.log('appointmentDate  = ' + appointmentList[z].appointmentDate);
            console.log('Todays Date  = ' + moment().utcOffset(330).format('YYYY-MM-DD'));
            console.log('dateIndex  = ' + dateIndex);
            console.log('Number Of Assistant Found = ' + appointmentDayAssistantList.length)
            console.log('Requested Slot = ' + appointmentList[z].appointmentSlotId)
            for (let y = 0; y < appointmentDayAssistantList.length; y++) {
              console.log('Start Slot: ' + appointmentDayAssistantList[y].shiftFirstSlotId
                + ", End Slot: " + appointmentDayAssistantList[y].shiftLastSlotId
                + ", No Of Appointments: " + appointmentDayAssistantList[y].numberOfAppointments
                + ", On Leave: " + appointmentDayAssistantList[y].onLeaveThisDay
                + ", "
                + appointmentDayAssistantList[y].physicianAssistantId);
            }

            for (let i = 0; i < appointmentDayAssistantList.length; i++) {
              if (appointmentDayAssistantList[i].shiftFirstSlotId <= appointmentList[z].appointmentSlotId
                && appointmentDayAssistantList[i].shiftLastSlotId >= appointmentList[z].appointmentSlotId
                && !appointmentDayAssistantList[i].weeklyDayOff
                && !appointmentDayAssistantList[i].onLeaveThisDay
                && appointmentDayAssistantList[i].physicianAssistantId !== assistantId) {
                const exsistingAppointment = await Appointment.findOne({
                  assistantId: appointmentDayAssistantList[i].physicianAssistantId,
                  appointmentDate: appointmentList[z].appointmentDate,
                  appointmentSlotId: appointmentList[z].appointmentSlotId
                });
                if (!exsistingAppointment) {
                  console.log('Assistant Fount Id = ' + appointmentDayAssistantList[i].physicianAssistantId);
                  newAssistantId = appointmentDayAssistantList[i].physicianAssistantId;
                  appointmentDayAssistantList[i].numberOfAppointments = appointmentDayAssistantList[i].numberOfAppointments + 1;
                  appointmentUpdatedWithNewAssistant = true;
                  break;
                } else if (iAmBackupAssistant === 'NA' && indexOfBackupAssistant == -1) {
                  //console.log(exsistingAppointment);
                  iAmBackupAssistant = appointmentDayAssistantList[i].physicianAssistantId;
                  indexOfBackupAssistant = i;
                }
              }
            }

            if (newAssistantId === 'NA') {
              console.log("Unable to find Assistant for Appointment ID: " + appointmentList[z].id);
              if (iAmBackupAssistant !== 'NA' && indexOfBackupAssistant != -1) {
                console.log("Allocating Backup Assistant:  " + appointmentDayAssistantList[indexOfBackupAssistant].physicianAssistantId);
                newAssistantId = appointmentDayAssistantList[indexOfBackupAssistant].physicianAssistantId;
                appointmentDayAssistantList[indexOfBackupAssistant].numberOfAppointments = appointmentDayAssistantList[indexOfBackupAssistant].numberOfAppointments + 1;
                appointmentUpdatedWithNewAssistant = true;
              }
            }

            //this is a sorted array by numberOfAppointments 
            var sortedAssistantList = appointmentDayAssistantList.sort((n1, n2) => {
              if (n1.numberOfAppointments > n2.numberOfAppointments) {
                return 1;
              }
              if (n1.numberOfAppointments < n2.numberOfAppointments) {
                return -1;
              }
              return 0;
            });

            // console.log('--------- After Allocation ------- ');
            // for (let i = 0; i < sortedAssistantList.length; i++) {
            //   console.log(sortedAssistantList[i].numberOfAppointments + " " + sortedAssistantList[i].physicianAssistantId);
            // }

            assistantRoster.availableAssistantList.splice(dateIndex, 1, sortedAssistantList);
            await assistantRoster.save();
            appointmentDayAssistantList = [...assistantRoster.availableAssistantList[dateIndex]];

            //update Appointment with new assistant 
            if (appointmentUpdatedWithNewAssistant) {

              const appointment = await Appointment.findById(appointmentList[z].id);
              if (appointment) {

                const assistantAppList = [...appointment.assistantAppointmentTimeLine];

                const assistantAppointmentTrack = {
                  stateUpdateTime: new Date(),
                  state: appointment.appointmentStatus,
                  appointmentDate: appointment.assistantAppointmentDate,
                  appointmentSlotId: String(appointment.assistantAppointmentSlotId),
                  appointmentRescheduleEnabled: appointment.appointmentRescheduleEnabled,
                  updatedBy: UserType.System,
                }

                assistantAppList.push(assistantAppointmentTrack);

                appointment.set({
                  assistantAppointmentTimeLine: assistantAppList,
                  appointmentPaymentStatus: AppointmentPaymentStatus.Booked,
                  assistantId: newAssistantId,
                  appointmentStatus: assistantAppointmentTrack.state,
                  assistantAppointmentDate: appointment.assistantAppointmentDate,
                  assistantAppointmentSlotId: appointment.assistantAppointmentSlotId,
                  assistantConsecutiveBookedSlots: appointment.assistantConsecutiveBookedSlots,
                });
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
                  updatedBy: UserType.System,
                  updateType: AppointmentUpdateType.AssistantChanged
                });
              }
            }
          }
        }
      }
    }

    const apiResponse: ApiResponse = {
      status: 200,
      message: 'Success',
      data: "Leave marked Successfully"
    };

    res.status(200).send(apiResponse);
  }
);

export { router as markAssistantLeaveRouter };
