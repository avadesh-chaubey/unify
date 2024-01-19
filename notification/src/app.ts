import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@unifycaredigital/aem';
import { loggerMiddleware, winstonMiddleware } from '@unifycare/logger';
import { sendNotificationRouter } from './routes/send-notification';
import { updateDeviceTokenRouter } from './routes/update-device-token';
import { removeDeviceTokenRouter } from './routes/remove-device-token';
import { updateUserFirebaseIdRouter } from './routes/update-user-uid';
import { showUserFirebaseIdRouter } from './routes/show-user-uid';
import { inviteDoctorInActiveCallRouter } from './routes/invite-doctor-in-active-call';
import { startVideoCallRouter } from './routes/start-video-call';
import { stopVideoCallRouter } from './routes/stop-video-call';
import { updateAgoraUidRouter } from './routes/update-agora-uid-in-appointment';
import { showAgoraUidRouter } from './routes/show-agora-uid-in-appointment';

import { Liveness } from './models/liveness';
import { PingPublisher } from './events/publishers/ping-publisher';
import { natsWrapper } from './nats-wrapper';
import { sendPushNotificationRouter } from './routes/send-notifications-multiple-users';

const MAX_MISSED_PING_COUNT = 1;


const probe = require('kube-probe');

var cors = require('cors')

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

probe(app, {
  bypassProtection: true,
  livenessCallback: async (request: any, response: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): any; new(): any; }; }; }) => {
    let liveness = await Liveness.findOne({});
    if (liveness) {
      liveness.set({
        currentSerialNumber: liveness.currentSerialNumber + 1,
        oldSerialNumber: liveness.oldSerialNumber,
        pingCount: liveness.pingCount + 1
      });
      await liveness.save();
      new PingPublisher(natsWrapper.client).publish({
        serialNumber: liveness.currentSerialNumber,
        clientId: String(process.env.NATS_CLIENT_ID)
      });
      if (liveness.pingCount > MAX_MISSED_PING_COUNT) {
        console.log(`${String(process.env.NATS_CLIENT_ID)} : Not OK`);
        return response.status(404).send('Not OK')
      }
    }
    return response.status(200).send('OK');
  }
});

app.use(currentUser);

app.use(loggerMiddleware);
app.use(winstonMiddleware);
app.use(sendNotificationRouter);
app.use(updateDeviceTokenRouter);
app.use(updateUserFirebaseIdRouter);
app.use(removeDeviceTokenRouter);
app.use(showUserFirebaseIdRouter);
app.use(inviteDoctorInActiveCallRouter);
app.use(startVideoCallRouter);
app.use(stopVideoCallRouter);
app.use(updateAgoraUidRouter);
app.use(showAgoraUidRouter);
app.use(sendPushNotificationRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
