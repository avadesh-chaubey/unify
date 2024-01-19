import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import { swaggerPostDocument } from './swagger-post';
import { swaggerGetDocument } from './swagger-get';
import { swaggerPutDocument } from './swagger-put';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@unifycaredigital/aem';
import { loggerMiddleware, winstonMiddleware } from '@unifycare/logger';
import { createPartnerBankDetailsRouter } from './routes/create-partner-bank-details';
import { createPartnerInfoRouter } from './routes/create-partner-information';
import { createPartnerSigningAuthRouter } from './routes/create-partner-signing-auth';
import { createPartnerEmployeeRouter } from './routes/create-partner-employee';
import { indexPartnerStateRouter } from './routes/index';
import { resendInviteEmployeeRouter } from './routes/resend-invite-mail-employee';
import { showAllPartnerSuperuserRouter } from './routes/show-all-superuser';
import { showPartnerBankDetailsRouter } from './routes/show-partner-bank-details';
import { showPartnerEmployeeRouter } from './routes/show-partner-employee';
import { showAllPartnerEmployeeRouter } from './routes/show-all-partner-employee';
import { showPartnerInfoRouter } from './routes/show-partner-information';
import { showPartnerSigningAuthRouter } from './routes/show-partner-signing-auth';
import { showPartnerSuperuserRouter } from './routes/show-superuser';
import { updateBankDetailsRouter } from './routes/update-bank-details';
import { updateInfoRouter } from './routes/update-information';
import { updatePartnerBankDetailsRouter } from './routes/update-partner-bank-details';
import { updatePartnerSubuserStatusRouter } from './routes/update-partner-employee-status';
import { updatePartnerInfoRouter } from './routes/update-partner-information';
import { updatePartnerSigningAuthRouter } from './routes/update-partner-signing-auth';
import { updateSigningAuthRouter } from './routes/update-signing-auth';
import { updatePartnerSuperuserStatusRouter } from './routes/update-superuser-status';
import { showAllDoctorsRouter } from './routes/show-all-doctors';
import { showAllDoctorsWithLocationRouter } from './routes/show-all-doctors-with-location';
import { updateConsultationChargesRouter } from './routes/update-consultation-charges';
import { updateSelfProfileImageRouter } from './routes/update-self-image';
import { showEmployeeSelfInfoRouter } from './routes/show-employee-self-info'
import { updatePartnerEmployeeRouter } from './routes/update-partner-employee';
import { Liveness } from './models/liveness';
import { PingPublisher } from './events/publishers/ping-publisher';
import { natsWrapper } from './nats-wrapper';
import { showAllAssistantsRouter } from './routes/show-all-assistants';
import { createSpecialityRouter } from './routes/create-speciality';
import { showAllSpecialityRouter } from './routes/show-all-speciality';
import { showAllPartnerRouter } from './routes/show-all-partner';
import { createPartnerLogoInfoRouter } from './routes/create-partner-logo-prescription';
import { showPartnerLogoInfoRouter } from './routes/show-partner-logoinfo';
import { updatePartnerLogoInfoRouter } from './routes/update-partner-logo';
import { showSearchPartnerByCityRouter } from './routes/search-partner-information-by-city';
import { showSearchDoctorProfileRouter } from './routes/search-doctor-profile';
import { createDoctorProfileRouter } from './routes/create-doctor-profile';
import { createvideoTagRouter } from './routes/create-new-video-tag';
import { createArticleTagRouter } from './routes/create-new-article-tag';
import { findDoctorProfileRouter } from './routes/find-doctor-profile-by-unique-id';
import { findArticleTagRouter } from './routes/find-all-articles';
import { findvideoTagRouter } from './routes/find-all-tags';
import { findDoctorDetailsRouter } from './routes/find-doctor-details-by-uniqueid';
import { findArticleTagByIdRouter } from './routes/find-tag-article-by-id';
import { findvideoTagByIdRouter } from './routes/find-tag-video-by-id';

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
app.use('/api/partner/swagger/post', swaggerUi.serve, swaggerUi.setup(swaggerPostDocument));
app.use('/api/partner/swagger/get', swaggerUi.serve, swaggerUi.setup(swaggerGetDocument));
app.use('/api/partner/swagger/put', swaggerUi.serve, swaggerUi.setup(swaggerPutDocument));
app.use(indexPartnerStateRouter);
app.use(createPartnerBankDetailsRouter);
app.use(createPartnerInfoRouter);
app.use(createPartnerSigningAuthRouter);
app.use(createPartnerEmployeeRouter);
app.use(showAllPartnerSuperuserRouter);
app.use(showPartnerBankDetailsRouter);
app.use(showPartnerInfoRouter);
app.use(showPartnerSigningAuthRouter);
app.use(showPartnerEmployeeRouter);
app.use(showPartnerSuperuserRouter);
app.use(updatePartnerBankDetailsRouter);
app.use(updatePartnerInfoRouter);
app.use(updatePartnerSubuserStatusRouter);
app.use(updatePartnerSuperuserStatusRouter);
app.use(updatePartnerSigningAuthRouter);
app.use(updateBankDetailsRouter);
app.use(updateInfoRouter);
app.use(updateSigningAuthRouter);
app.use(showAllPartnerEmployeeRouter);
app.use(resendInviteEmployeeRouter);
app.use(showAllDoctorsRouter);
app.use(showAllDoctorsWithLocationRouter);
app.use(updateConsultationChargesRouter);
app.use(updateSelfProfileImageRouter);
app.use(showEmployeeSelfInfoRouter);
app.use(updatePartnerEmployeeRouter);
app.use(showAllAssistantsRouter);
app.use(createSpecialityRouter);
app.use(showAllSpecialityRouter);
app.use(showAllPartnerRouter);
app.use(createPartnerLogoInfoRouter);
app.use(showPartnerLogoInfoRouter);
app.use(updatePartnerLogoInfoRouter);
app.use(showSearchPartnerByCityRouter);
app.use(showSearchDoctorProfileRouter);
app.use(createDoctorProfileRouter);
app.use(createvideoTagRouter);
app.use(createArticleTagRouter);
app.use(findDoctorProfileRouter);
app.use(findArticleTagRouter);
app.use(findvideoTagRouter);
app.use(findDoctorDetailsRouter);
app.use(findArticleTagByIdRouter);
app.use(findvideoTagByIdRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
