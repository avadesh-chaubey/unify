import {
  Subjects,
  Publisher,
  OTPExpiredEvent,
} from '@unifycaredigital/aem';

export class OTPExpirationPublisher extends Publisher<
  OTPExpiredEvent
  > {
  subject: Subjects.OTPExpired = Subjects.OTPExpired;
}
