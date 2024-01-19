import { Order } from '../order';
import mongoose from 'mongoose';
import { OrderStatus, OrderType } from '@unifycaredigital/aem';
import short from 'short-uuid';
import { Counter } from '../counter'

async function getNextSequenceValue(sequenceName: string) {
  var sequenceDocument = await Counter.findOneAndUpdate({
    _id: sequenceName,
    $inc: { sequence_value: 1 },
    new: true
  });
  return sequenceDocument.sequence_value;
}

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();

  let arhOrderId = await getNextSequenceValue('arhorderId');

  console.log(arhOrderId);

  const order = Order.build({
    id,
    priceInINR: 500,
    patientId: new mongoose.Types.ObjectId().toHexString(),
    currency: 'INR',
    productId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    order_id: 'NA',
    receipt: short.uuid(),
    parentId: id,
    orderType: OrderType.PaidAppointment,
    arhOrderId: arhOrderId
  });
  // Save the profile to the database
  await order.save();

  const id2 = new mongoose.Types.ObjectId().toHexString();

  arhOrderId = await getNextSequenceValue('arhorderId');
  console.log(arhOrderId);

  const order2 = Order.build({
    id: id2,
    priceInINR: 500,
    patientId: new mongoose.Types.ObjectId().toHexString(),
    currency: 'INR',
    productId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    order_id: 'NA',
    receipt: short.uuid(),
    parentId: id2,
    orderType: OrderType.PaidAppointment,
    arhOrderId: arhOrderId
  });
  // Save the profile to the database
  await order2.save();

  const id3 = new mongoose.Types.ObjectId().toHexString();

  arhOrderId = await getNextSequenceValue('arhorderId');
  console.log(arhOrderId);

  const order3 = Order.build({
    id: id3,
    priceInINR: 500,
    patientId: new mongoose.Types.ObjectId().toHexString(),
    currency: 'INR',
    productId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    order_id: 'NA',
    receipt: short.uuid(),
    parentId: id3,
    orderType: OrderType.PaidAppointment,
    arhOrderId: arhOrderId
  });
  // Save the profile to the database
  await order3.save();

  console.log(order3);


  // fetch the profile twice
  const firstInstance = await Order.findById(order.id);
  const secondInstance = await Order.findById(order.id);

  // make two separate changes to the profiles we fetched
  firstInstance!.set({ basePriceInINR: 600 });
  secondInstance!.set({ basePriceInINR: 700 });

  // save the first fetched profile
  await firstInstance!.save();

  // save the second fetched profile and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id,
    priceInINR: 500,
    patientId: new mongoose.Types.ObjectId().toHexString(),
    currency: 'INR',
    productId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    order_id: 'NA',
    receipt: short.uuid(),
    parentId: id,
    orderType: OrderType.PaidAppointment,
    arhOrderId: await getNextSequenceValue('arhorderId')
  });

  // Save the profile to the database
  await order.save();
  expect(order.version).toEqual(0);
  await order.save();
  expect(order.version).toEqual(1);
  await order.save();
  expect(order.version).toEqual(2);
});

