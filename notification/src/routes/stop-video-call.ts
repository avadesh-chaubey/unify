import express, { Request, Response } from 'express';
import { NotFoundError, requireAuth, UserType, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment';
import { VideoCall } from '../models/video-call';
import { fbDatabase } from '../firebase';
import moment from 'moment';

const router = express.Router();
router.get(
    '/api/notification/stopvideocall/:appointmentId',
    requireAuth,
    async (req: Request, res: Response) => {

        const appointmentId = req.params.appointmentId;
        let appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            console.log("Appointment not found " + appointmentId);
            throw new NotFoundError();
        }

        let videoCall = await VideoCall.findById(appointmentId);
        if (videoCall) {
            let callerName = appointment.assistantName;

            let callDetailList = [...videoCall.callDetails];

            if (callDetailList[0].isCallInProgress) {
                const callEndTime = new Date();
                const durationInMilliSec = (callEndTime.getTime() - callDetailList[0].callStartTime.getTime()) / 1000;
                const durationInMinutes = Math.floor(durationInMilliSec / 60) % 60;
                const callDetails = {
                    callStartTime: callDetailList[0].callStartTime,
                    callEndTime: callEndTime,
                    durationInMin: durationInMinutes,
                    isCallInProgress: false,
                    startById: callDetailList[0].startById,
                    endById: req.currentUser!.id
                }
                callDetailList[0] = callDetails;
                videoCall.set({
                    callDetails: callDetailList
                });
                await videoCall.save();

                if (req.currentUser!.uty !== UserType.PhysicianAssistant) {
                    callerName = appointment.consultantName;
                }

                const currentTime = String(moment().utcOffset(330).format('ddd DD-MMM-YYYY, hh:mm A'));
                let consultMessage = {
                    type: 'text',
                    text: `Video Call Ended by ${callerName} \n${currentTime}`,
                    createdAt: new Date().getTime(),
                    system: true,
                };
                fbDatabase.ref('conversations/' + appointmentId + '/messages').push().set(consultMessage);
            }

        }

        const apiResponse: ApiResponse = {
            status: 200,
            message: 'Success',
            data: 'Successful'
        };

        res.status(200).send(apiResponse);
    }
);


export { router as stopVideoCallRouter };
