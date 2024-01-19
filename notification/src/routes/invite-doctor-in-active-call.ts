import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, DevicePushType, InternalServerError, NotificationType, requireConsultantAuth, UserType, BadRequestError, ApiResponse } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { Device } from '../models/device';
import { push } from '../push';
import { SendNotificationPublisher } from '../events/publishers/send-notification-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Appointment } from '../models/appointment';

const router = express.Router();
router.post(
    '/api/notification/invitedoctorinactivecall',
    requireConsultantAuth,
    [
        body('appointmentId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('User Id must be provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { appointmentId, title, body, token } = req.body;

        let appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            throw new BadRequestError("Appointment Not Found");
        }

        let remoteUserId = appointment.consultantId;
        if (req.currentUser!.uty !== UserType.PhysicianAssistant) {
            remoteUserId = appointment.assistantId;
        }

        let device = await Device.findById(remoteUserId);
        if (!device) {
            throw new BadRequestError("Remote User UID not found");
        }

        try {
            const registrationIOSIds = [];
            const registrationANDROIDIds = [];
            const registrationChromeIds = [];
            let iosTopic;
            let androidTopic;
            const numberOfDevices = 1;
            for (let i = 0; i < numberOfDevices; i++) {
                if (device.deviceType === DevicePushType.APM) {
                    if (device.voiptoken && device.voiptoken !== '') {
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
                        androidTopic = device.topic;
                    }
                }
            }

            var publisherUid = 0;

            let newBody = { ...body, channel: appointmentId, token: token, uid: publisherUid };

            const iosData = {
                retries: 1,
                title: title,
                custom: newBody,
                topic: iosTopic + ".voip",
                priority: 'high',
                sound: 'ringing.wav',
                pushType: 'voip',
                alert: 'new pushkit',
                contentAvailable: 1,

            };

            const androidData = {
                title: title,
                body: "",
                alert: `New call from ${String(process.env.SYSTEM_SENDER_FULL_NAME)}`,
                priority: 'high',
                forground: true,
                silent: true,
                custom: newBody
            };

            if (registrationIOSIds.length > 0) {
                const iosResult = await push.send(registrationIOSIds, iosData);
                console.log('ios result: ' + JSON.stringify(iosResult));
            }
            if (registrationANDROIDIds.length > 0) {
                const androidResult = await push.send(registrationANDROIDIds, androidData);
                console.log('android result: ' + JSON.stringify(androidResult));
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
            }
        } catch (err) {
            console.error(err);
            throw new InternalServerError();
        }

        const apiResponse: ApiResponse = {
            status: 200,
            message: 'Success',
            data: "Invitation Sent"
        };
        
        res.status(200).send(apiResponse);
    }
);


export { router as inviteDoctorInActiveCallRouter };
