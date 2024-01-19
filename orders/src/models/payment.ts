import mongoose from 'mongoose';

interface PaymentAttrs {
  payment_id: string,
  entity: string,
  amount: number,
  currency: string,
  status: string,
  order_id: string,
  invoice_id: string,
  international: boolean,
  method: string,
  amount_refunded: number,
  amount_transferred: number,
  refund_status: string,
  captured: boolean,
  description: string,
  card_id: string,
  bank: string,
  wallet: string,
  vpa: string,
  email: string,
  contact: string,
  error_code: string,
  error_description: string,
  error_source: string,
  error_step: string,
  error_reason: string,
  created_at: number
}

interface PaymentDoc extends mongoose.Document {
  payment_id: string,
  entity: string,
  amount: number,
  currency: string,
  status: string,
  order_id: string,
  invoice_id: string,
  international: boolean,
  method: string,
  amount_refunded: number,
  amount_transferred: number,
  refund_status: string,
  captured: boolean,
  description: string,
  card_id: string,
  bank: string,
  wallet: string,
  vpa: string,
  email: string,
  contact: string,
  error_code: string,
  error_description: string,
  error_source: string,
  error_step: string,
  error_reason: string,
  created_at: number
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    payment_id: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    invoice_id: {
      type: String,
    },
    international: {
      type: Boolean,
    },
    method: {
      type: String,
    },
    amount_refunded: {
      type: Number,
    },
    amount_transferred: {
      type: Number,
    },
    refund_status: {
      type: String,
    },
    captured: {
      type: Boolean,
    },
    description: {
      type: String,
    },
    card_id: {
      type: String,
    },
    bank: {
      type: String,
    },
    wallet: {
      type: String,
    },
    vpa: {
      type: String,
    },
    email: {
      type: String,
    },
    contact: {
      type: String,
    },
    error_code: {
      type: String,
    },
    error_description: {
      type: String,
    },
    error_source: {
      type: String,
    },
    error_step: {
      type: String,
    },
    error_reason: {
      type: String,
    },
    created_at: {
      type: Number,
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

paymentSchema.static('build', (attrs: PaymentAttrs) => {
  return new Payment(attrs);
});

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
