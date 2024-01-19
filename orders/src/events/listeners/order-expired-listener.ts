import { Listener, OrderExpiredEvent, Subjects, OrderStatus } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { OrderExpiredGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
  subject: Subjects.OrderExpired = Subjects.OrderExpired;
  queueGroupName = OrderExpiredGroupName;

  async onMessage(data: OrderExpiredEvent['data'], msg: Message) {

    let order = await Order.findOne({ productId: data.productId });
    if (!order) {
      msg.ack();
      return
    }

    if (order.status === OrderStatus.Paid || order.status === OrderStatus.AwaitingPayment) {
      msg.ack();
      return
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    msg.ack();
  }
};
