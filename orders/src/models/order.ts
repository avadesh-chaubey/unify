import { OrderStatus, OrderType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs {
    id: string;
    priceInINR: number;
    arhOrderId: number;
    patientId: string;
    currency: string;
    productId: string;
    parentId: string;
    status: OrderStatus;
    receipt: string;
    order_id: string;
    orderType: OrderType;
}

interface OrderDoc extends mongoose.Document {
    arhOrderId: number;
    priceInINR: number;
    patientId: string;
    currency: string;
    productId: string;
    parentId: string;
    status: OrderStatus;
    receipt: string;
    order_id: string;
    orderType: OrderType;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema(
    {
        arhOrderId: {
            type: Number,
            required: true
        },
        priceInINR: {
            type: Number,
            required: false,
            default: 0
        },
        patientId: {
            type: String,
            required: true
        },
        productId: {
            type: String,
            required: true
        },
        parentId: {
            type: String,
            required: true
        },
        order_id: {
            type: String,
            required: true
        },
        receipt: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        status: {
            type: OrderStatus,
            required: true
        },
        orderType: {
            type: OrderType,
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
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.static('findByEvent', (event: { id: string, version: number }) => {
    return Order.findOne({
        _id: event.id,
        version: event.version - 1,
    });
});

orderSchema.static('build', (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        order_id: attrs.order_id,
        priceInINR: attrs.priceInINR,
        status: attrs.status,
        currency: attrs.currency,
        patientId: attrs.patientId,
        parentId: attrs.parentId,
        productId: attrs.productId,
        receipt: attrs.receipt,
        orderType: attrs.orderType,
        arhOrderId: attrs.arhOrderId
    });
});

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
