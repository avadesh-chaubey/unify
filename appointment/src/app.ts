import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@unifycaredigital/aem';
import { loggerMiddleware, winstonMiddleware } from '@unifycare/logger';
import { addAppointmentSlotRouter } from './routes/add-appointment-slot';
import { addAppointmentRouter } from './routes/add-appointment';
import { cancelAppointmentRouter } from './routes/cancel-appointment';
import { completedAppointmentRouter } from './routes/complete-appointment';
import { removeAppointmentSlotRouter } from './routes/remove-appointment-slot';
import { rescheduleAppointmentRouter } from './routes/reschedule-appointment';
import { updateAppointmentSlotRouter } from './routes/update-appointment-slot';
import { viewAppointmentSlotRouter } from './routes/view-appointment-slot';
import { testUpdateSlotRouter } from './routes/test-update-slot';
import { viewConsultantAppointmentsRouter } from './routes/view-consultant-appointments';
import { viewAllAppointmentsRouter } from './routes/view-customer-appointments';
import { addAppointmentTimeTableRouter } from './routes/add-appointment-time-table';
import { viewAppointmentTimeTableRouter } from './routes/view-appointment-time-table';
import { markDoctorLeaveRouter } from './routes/mark-doctors-leave';
import { cancelDoctorLeaveRouter } from './routes/cancel-doctors-leave';
import { updateAssistantAppointmentRouter } from './routes/update-assistant-appointment';
import { addAssistantTimeTableRouter } from './routes/add-assistant-time-table';
import { viewAssistantTimeTableRouter } from './routes/view-assistant-time-table';
import { markForRescheduleAppointmentRouter } from './routes/mark-appointment-for-reschedule';
import { Liveness } from './models/liveness';
import { PingPublisher } from './events/publishers/ping-publisher';
import { natsWrapper } from './nats-wrapper';
import { markAssistantLeaveRouter } from './routes/mark-assistant-leave';
import { cancelAssistantLeaveRouter } from './routes/cancel-assistant-leave';
import { updateAppointmentAssistantRouter } from './routes/update-appointment-assistant';
import { showAllDoctorsRouter } from './routes/show-all-doctors';

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
app.use('/api/appointment/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(addAppointmentSlotRouter);
app.use(removeAppointmentSlotRouter);
app.use(viewAppointmentSlotRouter);
app.use(testUpdateSlotRouter);
app.use(addAppointmentRouter);
app.use(cancelAppointmentRouter);
app.use(completedAppointmentRouter);
app.use(rescheduleAppointmentRouter);
app.use(viewAllAppointmentsRouter);
app.use(updateAppointmentSlotRouter);
app.use(addAppointmentTimeTableRouter);
app.use(viewAppointmentTimeTableRouter);
app.use(viewConsultantAppointmentsRouter);
app.use(markDoctorLeaveRouter);
app.use(cancelDoctorLeaveRouter);
app.use(updateAssistantAppointmentRouter);
app.use(addAssistantTimeTableRouter);
app.use(viewAssistantTimeTableRouter);
app.use(markForRescheduleAppointmentRouter);
app.use(markAssistantLeaveRouter);
app.use(cancelAssistantLeaveRouter);
app.use(updateAppointmentAssistantRouter);
app.use(showAllDoctorsRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
