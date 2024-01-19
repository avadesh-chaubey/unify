import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { NotFoundError, requireAuth, validateRequest, DevicePushType, InternalServerError, NotificationType, UserType, BadRequestError, ChatMessageType, ApiResponse } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { Device } from '../models/device';
import { push } from '../push';
var { RtcTokenBuilder, RtcRole } = require('agora-access-token');
import { SendNotificationPublisher } from '../events/publishers/send-notification-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Appointment } from '../models/appointment';
import moment from 'moment';
import { fbDatabase, firebase } from '../firebase';
import { VideoCall } from '../models/video-call';


var appID = process.env.AGORA_APP_ID;
var appCertificate = process.env.AGORA_APP_CERTIFICATE;

const EXPIRATION_TIME_IN_SECONDS = 3600; //1 hour
const PATIENT_JOIN_TIME_BUFFER_IN_MIN = 30 * 24 * 60; //dev setting //1 Prod setting //30 * 24 * 60;
const CONSULTANT_EXIT_TIME_BUFFER_IN_MIN = 7 * 24 * 60;
const PATIENT_EXIT_TIME_BUFFER_IN_MIN = 1;
const APPOIINTMENT_SLICE_DURATION_IN_MIN = 15;
const DAYS_ALLOWED_FOR_VIDEO_CALL_AFTER_APPOINTMENT = 7;
const NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR = 60 / APPOIINTMENT_SLICE_DURATION_IN_MIN;

const router = express.Router();
router.post(
    '/api/notification/startvideocall',
    requireAuth,
    [
        body('appointmentId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('User Id must be provided'),
        body('title')
            .not()
            .isEmpty()
            .withMessage('Message title must be provided'),
        body('body')
            .not()
            .isEmpty()
            .withMessage('Message body must be provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        var currentTimestamp = Math.floor(Date.now() / 1000)
        var privilegeExpiredTs = currentTimestamp + EXPIRATION_TIME_IN_SECONDS
        var publisherUid = 0;

        const { appointmentId, title, body } = req.body;
        let appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            console.log("Appointment not found " + appointmentId);
            throw new NotFoundError();
        }

        let videoCall = await VideoCall.findById(appointmentId);
        if (!videoCall) {
            const callDetails = {
                callStartTime: new Date(),
                callEndTime: new Date(),
                durationInMin: 0,
                isCallInProgress: true,
                startById: req.currentUser!.id,
                endById: 'NA'
            }
            videoCall = VideoCall.build({
                id: appointmentId,
                callDetails: [callDetails]
            });
            await videoCall.save();
        } else {
            if (!videoCall.callDetails[0].isCallInProgress) {
                const callDetails = {
                    callStartTime: new Date(),
                    callEndTime: new Date(),
                    durationInMin: 0,
                    isCallInProgress: true,
                    startById: req.currentUser!.id,
                    endById: 'NA'
                }
                let callDetailList = [...videoCall.callDetails];
                callDetailList.unshift(callDetails);
                videoCall.set({
                    callDetails: callDetailList
                });
                await videoCall.save();
            }
        }

        if (moment().diff(moment(appointment.appointmentDate), 'days') > DAYS_ALLOWED_FOR_VIDEO_CALL_AFTER_APPOINTMENT) {
            console.log("Video/Audio Call Not Allowed");
            throw new BadRequestError("Video/Audio Call Not Allowed")
        }

        let remoteUserId = appointment.parentId;
        let callerName = appointment.consultantName;

        // Remember Slot 0 = 00:00 - 00:15
        // Slot 8 = 2:00 - 2:15 = 8/4 = 2  : [8%4 = 0  X APPOIINTMENT_SLICE_DURATION_IN_MIN]
        // Slot 44 = 11:00 - 11:15
        // Slot 45 = 11:15 - 11: 30 = 45/4 = 11 : [45%4 = 1 X APPOIINTMENT_SLICE_DURATION_IN_MIN]
        // Slot 46 = 46/NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR 
        //           : ((46%NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR)*APPOIINTMENT_SLICE_DURATION_IN_MIN)
        //         = 11 : 30 AM

        const appointmentStartTime = appointment.appointmentDate
            + " "
            + String(Math.floor(appointment.appointmentSlotId / NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR))
            + ":"
            + String((appointment.appointmentSlotId % NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR) * APPOIINTMENT_SLICE_DURATION_IN_MIN);

        //format 'YYYY-MM-DD HH:MM'
        console.log(appointmentStartTime);

        if (req.currentUser!.uty === UserType.Patient) {
            callerName = appointment.parentName;
            //Patient can start call only 1 min before the appointment
            let remaninginTimeInMin = moment(appointmentStartTime, 'YYYY-MM-DD HH:mm').diff(moment(), 'minutes') - 330;
            // For Appointment at 11:30, When Patient will try at  11:25 
            // remaninginTimeInSec = 5 
            console.log("remaninginTimeInMin = " + remaninginTimeInMin);
            if (remaninginTimeInMin > PATIENT_JOIN_TIME_BUFFER_IN_MIN) {
                throw new BadRequestError(`You can start call only ${PATIENT_JOIN_TIME_BUFFER_IN_MIN} minutes before appointment time.`);
            }
            // For Appointment at 11:30, If Patient tried at  11:55 
            // remaninginTimeInSec = -25  + 15  + 1 = -9 
            // For Appointment at 11:30, If Patient tried at  11:45 
            // remaninginTimeInSec = -15  + 15  + 1 = 1
            // else if (remaninginTimeInMin + (APPOIINTMENT_SLICE_DURATION_IN_MIN + PATIENT_EXIT_TIME_BUFFER_IN_MIN)
            //     < PATIENT_EXIT_TIME_BUFFER_IN_MIN) {
            else if (remaninginTimeInMin < (-1 * (APPOIINTMENT_SLICE_DURATION_IN_MIN + PATIENT_EXIT_TIME_BUFFER_IN_MIN))) {
                throw new BadRequestError(`You cannot start call after expiry of appointment time.`);
            }
            //If assistant is allocated for this appointment, call will go to assistant else doctor
            if (appointment.assistantId === 'NA') {
                remoteUserId = appointment.consultantId;
            } else {
                remoteUserId = appointment.assistantId;
            }
        } else if (req.currentUser!.uty === UserType.PhysicianAssistant) {
            let remaninginTimeInMin = moment().diff(moment(appointmentStartTime, 'YYYY-MM-DD HH:mm'), 'minutes');
            if (remaninginTimeInMin > CONSULTANT_EXIT_TIME_BUFFER_IN_MIN) {
                throw new BadRequestError(`You cannot start call after expiry of grace period.`);
            }
            callerName = appointment.assistantName;
        } else {
            let remaninginTimeInMin = moment().diff(moment(appointmentStartTime, 'YYYY-MM-DD HH:mm'), 'minutes');
            if (remaninginTimeInMin > CONSULTANT_EXIT_TIME_BUFFER_IN_MIN) {
                throw new BadRequestError(`You cannot start call after expiry of grace period.`);
            }
        }

        let device = await Device.findById(remoteUserId);
        if (!device) {
            console.log(`Remote User not Available.`);
            throw new BadRequestError(`Remote User not Available.`);
        }

        try {
            console.log(`Start Video Call Notification 1`);
            const registrationIOSIds = [];
            const registrationANDROIDIds = [];
            const registrationChromeIds = [];
            let iosTopic;
            const numberOfDevices = 1;
            for (let i = 0; i < numberOfDevices; i++) {
                if (device.deviceType === DevicePushType.APM) {
                    if (device.token && device.token !== '') {
                        registrationIOSIds.push(device.token);
                        iosTopic = device.topic;
                    }
                } else if (device.deviceType === DevicePushType.WEB) {
                    if (device.token && device.token !== '') {
                        registrationChromeIds.push(device.token);
                    }
                } else {
                    if (device.token && device.token !== '') {
                        registrationANDROIDIds.push(device.token);
                    }
                }
            }

            var publisherRole = RtcRole.PUBLISHER;
            var publisherKey = RtcTokenBuilder.buildTokenWithUid(
                appID,
                appCertificate,
                appointmentId,
                publisherUid,
                publisherRole,
                privilegeExpiredTs
            );

            let newBody = { ...body, token: publisherKey, uid: publisherUid, channel: appointmentId };

            // //retries: 1,
            // title: title,
            // custom: newBody,
            // topic: iosTopic,
            // priority: 'high',
            // sound: 'ringing.wav',
            // //pushType: 'voip',
            // silent: true,
            // alert: 'new pushkit',
            // contentAvailable: 1,
            const iosData = {
                retries: 1,
                title: title,
                body: "Online Video Consultation",
                custom: newBody,
                topic: iosTopic,
                priority: 'high',
                sound: 'ringtone.caf',
                //pushType: 'voip',
                //alert: 'new pushkit',
                //expiry: Math.floor(Date.now() / 1000) + 6,
                //silent:"true",
                collapseKey: 1,
                contentAvailable: 1,

            };
            console.log(`Start Video Call Notification 2 setting ios Data: iosTopic: ` + iosTopic);

            console.log(`Start Video Call Notification 2 setting ios Data` + JSON.stringify(iosData));


            const androidData = {
                data: {
                    title: title,
                    body: body,
                    badge: '1'
                }
                // title: title,
                // body: "Online Video Consultation",
                // channelId: "default-channel-id",
                // message: "Incoming call from " + newBody.callerName + " ...", // (required)
                // priority: "high",
                // custom: newBody,
                // tag: "local_notificatiom_video",
                // sound: "ringback.mp3",
                // android_channel_id: "default-channel-id",
            };

            if (registrationIOSIds.length > 0) {
                //const iosResult = await push.send(registrationIOSIds, iosData);
                //console.log('ios result: ' + JSON.stringify(iosResult));
                new SendNotificationPublisher(natsWrapper.client).publish({
                    to: registrationIOSIds as [string],
                    title: title,
                    body: JSON.stringify(iosData),
                    type: NotificationType.VoipCall,
                    sendDateAndTime: new Date(),
                    url: 'https://fcm.googleapis.com/fcm/send',
                    key: `key=${process.env.GCM_API_KEY}`,
                });
            } else {
                console.log(`Start Video Call Notification registrationIOSIds.length = 0`);
            }
            if (registrationANDROIDIds.length > 0) {
                // const androidResult = await push.send(registrationANDROIDIds, androidData);
                // console.log('android result: ' + JSON.stringify(androidResult));
                const options = {
                    priority: "high"
                };
                const androidResult = await firebase.messaging().sendToDevice(registrationANDROIDIds[0], androidData, options);
                console.log('Android result: ' + JSON.stringify(androidResult));
            } else {
                console.log(`Start Video Call Notification registrationANDROIDIds.length = 0`);
            }
            if (registrationChromeIds.length > 0) {

                new SendNotificationPublisher(natsWrapper.client).publish({
                    to: registrationChromeIds as [string],
                    title: title,
                    body: newBody,
                    type: NotificationType.VideoCall,
                    sendDateAndTime: new Date(),
                    url: 'https://fcm.googleapis.com/fcm/send',
                    key: `key=${process.env.GCM_API_KEY}`,
                });
            } else {
                console.log(`Start Video Call Notification registrationChromeIds.length = 0`);
            }
        } catch (err) {
            console.error(err);
            throw new InternalServerError();
        }
        const currentTime = String(moment().utcOffset(330).format('ddd DD-MMM-YYYY, hh:mm A'));
        let consultMessage = {
            type: 'text',
            text: `Video Call Started by ${callerName} \n${currentTime}`,
            createdAt: new Date().getTime(),
            system: true,
        };
        fbDatabase.ref('conversations/' + appointmentId + '/messages').push().set(consultMessage);

        const apiResponse: ApiResponse = {
            status: 200,
            message: 'Success',
            data: { token: publisherKey, uid: publisherUid, channel: appointmentId }
        };


        res.status(200).send(apiResponse);
    }
);

export { router as startVideoCallRouter };
