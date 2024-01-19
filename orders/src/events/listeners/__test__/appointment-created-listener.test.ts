import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus, OrderType } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Order } from '../../../models/order';

const setup = async () => {
  // Create an instance of the listener

  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    patientId: new mongoose.Types.ObjectId().toHexString(),
    productId: new mongoose.Types.ObjectId().toHexString(),
    expirationDate: new Date(),
    priceInINR: 500,
    parentId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    numberOfRetry: 1,
    orderType: OrderType.PaidAppointment,
    version: 1

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

  expect(order!.status).toEqual(OrderStatus.Created);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

