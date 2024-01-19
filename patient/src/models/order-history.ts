import { OrderType, OrderStatus } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderHistoryAttrs {
  id: string;
  patientId: string;
  parentId: string;
  priceInINR: number;
  paymentMode: string;
  arhOrderid: number;
  orderType: OrderType;
  orderDate: Date;
  orderId: string;
  orderPaymentStatus: OrderStatus;
}

interface OrderHistoryDoc extends mongoose.Document {
  patientId: string;
  parentId: string;
  priceInINR: number;
  arhOrderid: number;
  orderType: OrderType;
  paymentMode: string;
  orderDate: Date;
  orderPaymentStatus: OrderStatus;
  orderId: string;
  version: number;
}

interface OrderHistoryModel extends mongoose.Model<OrderHistoryDoc> {
  build(attrs: OrderHistoryAttrs): OrderHistoryDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<OrderHistoryDoc | null>;
}

const orderHistorySchema = new mongoose.Schema(
  {
    orderType: {
      type: OrderType,
      required: true
    },
    patientId: {
      type: String,
      required: true
    },
    parentId: {
      type: String,
      required: true
    },
    priceInINR: {
      type: Number,
    },
    arhOrderid: {
      type: Number,
    },
    orderDate: {
      type: Date,
      required: true
    },
    orderPaymentStatus: {
      type: OrderStatus,
      required: true
    },
    orderId: {
      type: String,
      required: true
    },
    paymentMode: {
      type: String,
      required: true
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
orderHistorySchema.set('versionKey', 'version');
orderHistorySchema.plugin(updateIfCurrentPlugin);

orderHistorySchema.static('findByEvent', (event: { id: string, version: number }) => {
  return OrderHistory.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

orderHistorySchema.static('build', (attrs: OrderHistoryAttrs) => {
  return new OrderHistory({
    _id: attrs.id,
    patientId: attrs.patientId,
    parentId: attrs.parentId,
    priceInINR: attrs.priceInINR,
    arhOrderid: attrs.arhOrderid,
    orderType: attrs.orderType,
    orderDate: attrs.orderDate,
    orderPaymentStatus: attrs.orderPaymentStatus,
    orderId: attrs.orderId,
    paymentMode: attrs.paymentMode
  });
});

const OrderHistory = mongoose.model<OrderHistoryDoc, OrderHistoryModel>('OrderHistory', orderHistorySchema);

export { OrderHistory };