import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@unifycaredigital/aem';
import { loggerMiddleware, winstonMiddleware } from '@unifycare/logger';

import { addNewFamilyMemberRouter } from './routes/add-new-family-member';
import { addCaseSheetRouter } from './routes/add-patient-casesheet';
import { addPatientDocumentRouter } from './routes/add-patient-Document';
import { createDeliveryOrderRouter } from './routes/create-delivery-order';
import { indexPatientRouter } from './routes/index';
import { payDeliveryOrderRouter } from './routes/pay-delivery-order';
import { showAllAppointmentsRouter } from './routes/show-all-appointments';
import { showAllFamilyMembersRouter } from './routes/show-all-family-members';
import { showAllPatientsRouter } from './routes/show-all-patients';
import { showAAppointmentCaseSheetRouter } from './routes/show-appointment-casesheet';
import { showAllAppointmentsOfPatientRouter } from './routes/show-appointments-of-patient';
import { showConsultantAppointmentsRouter } from './routes/show-consultant-appointments';
import { showFamilyMemberAppointmentsRouter } from './routes/show-family-member-appointments';
import { showFamilyMemberOrderHistoryRouter } from './routes/show-family-member-order-history';
import { showFamilyPastAppointmentsRouter } from './routes/show-family-past-appointments';
import { showFamilyUpcomingAppointmentsRouter } from './routes/show-family-upcoming-appointments';
import { showPatientHomePageBannerRouter } from './routes/show-home-page-banner';
import { showMyAppointmentsRouter } from './routes/show-my-appointments';
import { showMyOrderHistoryRouter } from './routes/show-my-order-history';
import { showPatientDetailsRouter } from './routes/show-patient-details';
import { showTodayAppointmentsRouter } from './routes/show-today-appointments';
import { updateFamilyMemberMHRIDRouter } from './routes/update-family-member-mhr-id';
import { updateMemberProfileImageRouter } from './routes/update-family-member-profile-image';
import { updateMemberProfileDataRouter } from './routes/update-family-member-profile-data';
import { updateFixedPriceRouter } from './routes/update-fixed-price';
import { updateCaseSheetRouter } from './routes/update-patient-casesheet';
import { updatePatientMHRIDRouter } from './routes/update-patient-mhr-id';
import { updateSelfMHRIDRouter } from './routes/update-self-mhr-id';
import { updateSelfProfileImageRouter } from './routes/update-self-profile-image';
import { updateSelfProfileDataRouter } from './routes/update-self-profile-data';
import { viewFixedPriceRouter } from './routes/view-fixed-price';
import { showAssistantAppointmentsRouter } from './routes/show-assistant-appointments';
import { showDeliveryOrderRouter } from './routes/show-delivery-order';
import { showAppoiintmentOrderRouter } from './routes/show-appointment-order';
import { showAllFamilyMemberAppointmentsRouter } from './routes/show-all-family-member-appointments';
import { showPatientByIdRouter } from './routes/show-patient-by-id';
import { downloadPrescriptionRouter } from './routes/download-prescription';
import { showAppointmentByIdRouter } from './routes/show-appointment-by-id';
import { showPastAppointmentsRouter } from './routes/show-past-appointments';
import { updateDeliveryOrderRouter } from './routes/update-delivery-order';
import { updateHealthRecordInCaseSheetRouter } from './routes/update-health-record-in-casesheet';
import { showFixedPriceRouter } from './routes/show-fixed-price';
import { addRating } from './routes/add-rating';
import { getConsultantStatsRouter } from './routes/show-consultant-stats';
import {fhirPatientsRouter} from './routes/fhir-test/patient-insert'


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
app.use(indexPatientRouter);
app.use(showAllFamilyMembersRouter);
app.use(updateSelfProfileImageRouter);
app.use(addNewFamilyMemberRouter);
app.use(updateMemberProfileImageRouter);
app.use(showMyAppointmentsRouter);
app.use(showFamilyMemberAppointmentsRouter);
app.use(showConsultantAppointmentsRouter);
app.use(showAllAppointmentsRouter);
app.use(showAllPatientsRouter);
app.use(showTodayAppointmentsRouter);
app.use(showAllAppointmentsOfPatientRouter);
app.use(showPatientHomePageBannerRouter);
app.use(updateFamilyMemberMHRIDRouter);
app.use(updateMemberProfileDataRouter);
app.use(updatePatientMHRIDRouter);
app.use(updateSelfProfileDataRouter);
app.use(updateSelfMHRIDRouter);
app.use(showFamilyUpcomingAppointmentsRouter);
app.use(showPatientDetailsRouter);
app.use(updateFixedPriceRouter);
app.use(viewFixedPriceRouter);
app.use(addCaseSheetRouter);
app.use(showFamilyPastAppointmentsRouter);
app.use(updateCaseSheetRouter);
app.use(showAAppointmentCaseSheetRouter);
app.use(addPatientDocumentRouter);
app.use(createDeliveryOrderRouter);
app.use(payDeliveryOrderRouter);
app.use(showFamilyMemberOrderHistoryRouter);
app.use(showMyOrderHistoryRouter);
app.use(showAssistantAppointmentsRouter);
app.use(showDeliveryOrderRouter);
app.use(showAppoiintmentOrderRouter);
app.use(showAllFamilyMemberAppointmentsRouter);
app.use(showPatientByIdRouter);
app.use(downloadPrescriptionRouter)
app.use(showAppointmentByIdRouter);
app.use(showPastAppointmentsRouter);
app.use(updateDeliveryOrderRouter);
app.use(updateHealthRecordInCaseSheetRouter);
app.use(showFixedPriceRouter);
app.use(addRating);
app.use(getConsultantStatsRouter);
app.use(fhirPatientsRouter);
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
