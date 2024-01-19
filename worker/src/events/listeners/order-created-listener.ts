import { orderCreatedGroupName } from './queue-group-name';
import { orderExpirationQueue } from '../../queues/order-expiration-queue';
import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, OrderType, Subjects } from '@unifycaredigital/aem';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = orderCreatedGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    const delay = new Date(data.expirationDate).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process Order:', delay);

    if (delay < 0 || data.orderType === OrderType.FreeAppointment) {
      msg.ack();
      return
    }

    try {
      await orderExpirationQueue.add(
        {
          patientId: data.patientId,
          productId: data.productId,
        },
        {
          delay,
        }
      );
      msg.ack();
    } catch (error) {
      msg.ack();
      console.error(error);
    }
    msg.ack();
  }
}
