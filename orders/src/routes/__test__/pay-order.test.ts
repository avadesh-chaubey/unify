import request from 'supertest';
import { app } from '../../app';
import { UserStatus, UserType, AccessLevel, OrderStatus, OrderType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import short from 'short-uuid';


it('has a route handler listening to /api/order/pay for post requests', async () => {
  const response = await request(app)
    .post('/api/order/pay')
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/order/pay')
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/order/pay')
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid Id is provided', async () => {
  await request(app)
    .post('/api/order/pay')
    .set('Cookie', global.signin(UserType.Patient,
      AccessLevel.Patient,
      UserStatus.Active,
      new mongoose.Types.ObjectId().toHexString(),
      new mongoose.Types.ObjectId().toHexString()))
    .send({
      productId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(400);
});

it('returns an 200 if an valid Id is provided', async () => {

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
    receipt: short.uuid(),
    parentId: id,
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

  expect(response.body.status).toEqual(OrderStatus.AwaitingPayment);

  console.log(response.body);

});

