import { OrderCreatedGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects, BadRequestError, OrderStatus, OrderType } from '@unifycaredigital/aem';
import { Order } from '../../models/order';
import { Counter } from '../../models/counter';
import mongoose from 'mongoose';
import short from 'short-uuid';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = OrderCreatedGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    let order = await Order.findOne({ productId: data.productId });
    if (order) {
      if (order.orderType === OrderType.PaidAppointment
        || order.orderType === OrderType.FreeAppointment) {
        msg.ack();
        return;
      }
    }

    async function getNextSequenceValue(sequenceName: string) {
      var sequenceDocument = await Counter.findOneAndUpdate({
        _id: sequenceName,
        $inc: { sequence_value: 1 },
        new: true
      });
      return sequenceDocument!.sequence_value;
    }

    if (!order) {
      order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        currency: "INR",
        patientId: data.patientId,
        productId: data.productId,
        parentId: data.parentId,
        status: OrderStatus.Created,
        order_id: 'NA',
        receipt: short.uuid(),
        orderType: data.orderType,
        priceInINR: data.priceInINR,
        arhOrderId: await getNextSequenceValue('arhorderId')
      });
      await order.save();
    } else {
      order.set({
        currency: "INR",
        patientId: data.patientId,
        productId: data.productId,
        parentId: data.parentId,
        status: OrderStatus.Created,
        order_id: 'NA',
        receipt: short.uuid(),
        orderType: data.orderType,
        priceInINR: data.priceInINR,
        arhOrderId: await getNextSequenceValue('arhorderId')
      });
      await order.save();
    }
    console.log(order.currency + "  " + order.receipt + " " + order.priceInINR)

    msg.ack();
  }
}
