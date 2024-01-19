import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { UserType, AccessLevel, UserStatus, OrderType, OrderStatus } from '@unifycaredigital/aem';
import { Order } from '../../models/order';
import short from 'short-uuid';

it('returns a 200 even if the order is not found', async () => {
  const customerId = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/order/all/${customerId}`)
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send().expect(200);
});

it('returns the order if the order is found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id,
    priceInINR: 500,
    patientId: new mongoose.Types.ObjectId().toHexString(),
    orderType: OrderType.PaidAppointment,
    currency: 'INR',
    productId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    order_id: 'NA',
    parentId: id,
    receipt: short.uuid(),
    arhOrderId: 1
  });
  await order.save();

  const response = await request(app)
    .post('/api/order/pay')
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      order.parentId,
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      productId: order.productId,
    })
    .expect(200);


  const order1 = await request(app)
    .get(`/api/order/all/${response.body.parentId}`)
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send()
    .expect(200);

  console.log(order1.body);
  expect(order1.body[0].status).toEqual(OrderStatus.AwaitingPayment);
});
