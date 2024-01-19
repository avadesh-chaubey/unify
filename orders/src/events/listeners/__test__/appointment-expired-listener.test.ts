import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderExpiredEvent, OrderStatus, OrderType } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderExpiredListener } from '../order-expired-listener';
import { Order } from '../../../models/order';
import short from 'short-uuid';

const setup = async () => {
  // Create an instance of the listener

  const listener = new OrderExpiredListener(natsWrapper.client);
  const customerId = new mongoose.Types.ObjectId().toHexString();
  const productId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    priceInINR: 500,
    currency: "INR",
    patientId: customerId,
    productId: productId,
    parentId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    order_id: 'NA',
    receipt: short.uuid(),
    orderType: OrderType.PaidAppointment,
    arhOrderId: 1
  });
  await order.save();

  // Create the fake data event
  const data: OrderExpiredEvent['data'] = {
    patientId: customerId,
    productId: productId,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create new Appointment and wait for event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  console.log(data);

  const order = await Order.findOne({ productId: data.productId });

  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

