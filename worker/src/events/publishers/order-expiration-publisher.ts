import {
  Subjects,
  Publisher,
  OrderExpiredEvent,
} from '@unifycaredigital/aem';

export class OrderExpirationPublisher extends Publisher<
  OrderExpiredEvent
  > {
  subject: Subjects.OrderExpired = Subjects.OrderExpired;
}
