import { Subjects, Publisher, PaymentCompletedEvent } from '@unifycaredigital/aem';

export class PaymentCompletedPublisher extends Publisher<PaymentCompletedEvent> {
  subject: Subjects.PaymentCompleted = Subjects.PaymentCompleted;
}
