import { Subjects, Publisher, OrderUpdatedEvent } from '@unifycaredigital/aem';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}
