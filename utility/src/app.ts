import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@unifycaredigital/aem';
import { loggerMiddleware, winstonMiddleware } from '@unifycare/logger';
import { createCityRouter } from "./routes/create-city";
import { createDiagnosticTestRouter } from './routes/create-diagnostic-test';
import { createLanguageRouter } from './routes/create-language';
import { createMedicineRouter } from './routes/create-medicine';
import { downloadFileRouter } from './routes/download_file_from_cdn';
import { showAllCitiesRouter } from "./routes/show-all-cities";
import { showAllDiagnosticTestRouter } from './routes/show-all-diagnostic-test';
import { showAllLanguagesRouter } from './routes/show-all-language';
import { showAllMedicinesRouter } from './routes/show-all-medicine';
import { updateCityRouter } from "./routes/update-city";
import { updateDiagnosticTestRouter } from './routes/update-diagnostic-test';
import { updateLanguageRouter } from './routes/update-language';
import { updateMedicineRouter } from './routes/update-medicine';
import { uploadFileRouter } from './routes/upload_file_to_cdn';
import { showAllChiefComplaintsRouter } from "./routes/show-all-chief-complaint";
import { showAllMedicalConditionRouter } from './routes/show-all-medical-condition';
import { showAllMedicineTypesRouter } from './routes/show-all-medicine-types';
import { showAllSpecialityRouter } from './routes/show-all-speciality';
import { showAllSurgeryTypesRouter } from './routes/show-all-surgery-type';
import { showAllRouteOfAdministrationRouter } from './routes/show-all-route-of-administration';
import { showAllCategoriesRouter } from './routes/show-all-documents-category';
import { sendEmailPrescriptionRouter } from './routes/send-email-prescription';
import { smsTestRouter } from './routes/test-sms';
import { deleteDiagnosticTestRouter } from './routes/delete-diagnostic-test';
import { deleteMedicineRouter } from './routes/delete-medicine';
import { renameFileRouter } from './routes/rename_file_in_cdn copy';
import { showCountryRouter } from './routes/show-country';
import { showStateRouter } from './routes/show-states';
import { showCityRouter } from './routes/show-city';
import { showCountryAndISDCodeRouter } from './routes/show-all-countries-with-isd-code';

import { Liveness } from './model/liveness';
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
app.use(createCityRouter);
app.use(showAllCitiesRouter);
app.use(updateCityRouter);
app.use(uploadFileRouter);
app.use(downloadFileRouter);
app.use(createLanguageRouter);
app.use(showAllLanguagesRouter);
app.use(updateLanguageRouter);
app.use(createDiagnosticTestRouter);
app.use(createMedicineRouter);
app.use(showAllDiagnosticTestRouter);
app.use(showAllMedicinesRouter);
app.use(updateDiagnosticTestRouter);
app.use(updateMedicineRouter);
app.use(showAllChiefComplaintsRouter);
app.use(showAllMedicalConditionRouter);
app.use(showAllMedicineTypesRouter);
app.use(showAllSpecialityRouter);
app.use(showAllSurgeryTypesRouter);
app.use(showAllRouteOfAdministrationRouter);
app.use(showAllCategoriesRouter);
app.use(sendEmailPrescriptionRouter);
app.use(smsTestRouter);
app.use(deleteDiagnosticTestRouter);
app.use(deleteMedicineRouter);
app.use(renameFileRouter);
app.use(showCountryRouter);
app.use(showStateRouter);
app.use(showCityRouter);
app.use(showCountryAndISDCodeRouter)


app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
