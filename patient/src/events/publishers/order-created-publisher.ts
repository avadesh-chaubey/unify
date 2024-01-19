import { Publisher, Subjects, OrderCreatedEvent } from '@unifycaredigital/aem';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
