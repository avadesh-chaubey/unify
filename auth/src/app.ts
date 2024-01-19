import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger'
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@unifycaredigital/aem';
import { loggerMiddleware, winstonMiddleware } from '@unifycare/logger';
import { currentUserRouter } from './routes/current-user';
import { emailSigninRouter } from './routes/email-otp-signin';
import { employeeEmailVerificationRouter } from './routes/employee-email-verification';
import { employeeForgotPasswordRouter } from './routes/employee-forgot-password';
import { employeeSigninRouter } from './routes/employee-pwd-signin';
import { employeeResetPasswordWithKeyRouter } from './routes/employee-reset-password-with-key';
import { employeeResetPasswordRouter } from './routes/employee-reset-password';
import { partnerOtpSignupRouter } from './routes/partner-otp-signup';
import { partnerSignupRouter } from './routes/partner-signup';
import { patientOTPSignupRouter } from './routes/patient-otp-signup';
import { phoneSigninRouter } from './routes/patient-phone-otp-signin';
import { patientSignupRouter } from './routes/patient-signup';
import { phoneVerifyRouter } from './routes/patient-phone-otp-verify';
import { sendEmailOTPRouter } from './routes/send-email-otp';
import { sendPhoneEmailOTPRouter } from './routes//send-phone-email-otp';
import { sendPhoneOTPRouter } from './routes/send-phone-otp';
import { sendVerificationEmailRouter } from './routes/send-verification-email';
import { signoutRouter } from './routes/signout';
import { Liveness } from './models/liveness';
import { PingPublisher } from './events/publishers/ping-publisher';
import { natsWrapper } from './nats-wrapper';
import { applicationVersionRouter } from './routes/application-version';
import { findDoctorRouter } from './routes/validate-doctor-by-employee-id';
import { sendPhoneOTPDoctorRouter } from './routes/send-phone-otp-doctor';
import { updateEmployeePinRouter } from './routes/update-employee-pin';
import { createRoleRouter } from './routes/create-roles';
import { getUserRoles } from './routes/find-all-roles';
import { updateRoleRouter } from './routes/update-role';
import { getallUser } from './routes/find-all-users';
import { attachEmployeeRoleRouter } from './routes/attach-role';
import { assignPermissionToRoleRouter } from './routes/assign-permissions-to-role';
import { getAssignPermissionToRoleRouter } from './routes/find-assign-permissions-to-role';
import { updateAssignPermissionToRoleRouter } from './routes/update-assign-permissions-to-role';
import { getAllUserRole } from './routes/find-all-roles-by-date-range';
import { updateUserStatusRouter } from './routes/update-user-status';
import { accessControlRouter } from './routes/access-control';
import { updateAccessControlRouter } from './routes/update-access-control';
import { doctorSigninRouter } from './routes/doctor-pin-signin';


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
app.use('/api/users/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(currentUserRouter);
app.use(emailSigninRouter);
app.use(phoneSigninRouter);
app.use(signoutRouter);
app.use(patientSignupRouter);
app.use(sendEmailOTPRouter);
app.use(sendPhoneEmailOTPRouter);
app.use(sendPhoneOTPRouter);
app.use(partnerSignupRouter);
app.use(partnerOtpSignupRouter);
app.use(employeeResetPasswordWithKeyRouter);
app.use(employeeSigninRouter);
app.use(employeeForgotPasswordRouter);
app.use(employeeEmailVerificationRouter);
app.use(sendVerificationEmailRouter);
app.use(phoneVerifyRouter);
app.use(patientOTPSignupRouter);
app.use(employeeResetPasswordRouter);
app.use(applicationVersionRouter);
app.use(findDoctorRouter);
app.use(sendPhoneOTPDoctorRouter);
app.use(updateEmployeePinRouter);
app.use(createRoleRouter);
app.use(getUserRoles);
app.use(updateRoleRouter);
app.use(getallUser);
app.use(attachEmployeeRoleRouter);
app.use(assignPermissionToRoleRouter);
app.use(getAssignPermissionToRoleRouter);
app.use(updateAssignPermissionToRoleRouter);
app.use(getAllUserRole);
app.use(updateUserStatusRouter);
app.use(accessControlRouter);
app.use(updateAccessControlRouter)
app.use(doctorSigninRouter);
+app.use(createRoleRouter);
app.use(getUserRoles);
app.use(updateRoleRouter);
app.use(getallUser);
app.use(attachEmployeeRoleRouter);
app.use(assignPermissionToRoleRouter);
app.use(getAssignPermissionToRoleRouter);
app.use(updateAssignPermissionToRoleRouter);
app.use(getAllUserRole);
app.use(updateUserStatusRouter);
app.use(accessControlRouter);
app.use(updateAccessControlRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
