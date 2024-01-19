import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@unifycaredigital/aem';
import { loggerMiddleware, winstonMiddleware } from '@unifycare/logger';
import { cancelOrderRouter } from './routes/cancel-order';
import { capturePaymentRouter } from './routes/capture-payment';
import { failedPaymentRouter } from './routes/failed-payment';
import { payOrderRouter } from './routes/pay-order';
import { newOrderRouter } from './routes/new-order';
import { viewPaymentRouter } from './routes/verify-payment';
import { viewOrderRouter } from './routes/view-order';
import { viewOrdersRouter } from './routes/view-orders';
import { mockCapturePaymentRouter } from './routes/capture-mock-payment';
import { payAppointmentOrderRouter } from './routes/pay-appointment-order';
import { payPharmacyOrderRouter } from './routes/pay-pharmacy-order';
import { payTestlabOrderRouter } from './routes/pay-testlab-order';

import { Liveness } from './models/liveness';
import { PingPublisher } from './events/publishers/ping-publisher';
import { natsWrapper } from './nats-wrapper';

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
app.use('/api/order/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cancelOrderRouter);
app.use(viewOrderRouter);
app.use(viewOrdersRouter);
app.use(capturePaymentRouter);
app.use(failedPaymentRouter);
app.use(viewPaymentRouter);
app.use(payOrderRouter);
app.use(newOrderRouter);
app.use(mockCapturePaymentRouter);
app.use(payAppointmentOrderRouter);
app.use(payPharmacyOrderRouter);
app.use(payTestlabOrderRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
