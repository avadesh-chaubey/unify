import express, { Request, Response } from 'express';
import {
  SecurityError,
  OrderStatus,
} from '@unifycaredigital/aem';
import { Order } from '../models/order';
import { PaymentCompletedPublisher } from '../events/publishers/payment-completed-publisher';
import { natsWrapper } from '../nats-wrapper';
import crypto from 'crypto';
import { Payment } from '../models/payment';

const router = express.Router();

router.post(
  '/api/order/capture',
  async (req: Request, res: Response) => {

    console.log("Capture Webhook Called");
   
    const shasum = crypto.createHmac('sha256', process.env.JWT_KEY!.toString());
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest !== req.headers['x-razorpay-signature']) {
      throw new SecurityError("Precondition Failed");
    } else {
      console.log("Capture Webhook Called Successfully");
      const apiResponse = {
        status: 200,
        message: 'Success',
        data: "Successful"
      }
      res.send(apiResponse);
      

      const paymentObj = req.body.payload.payment.entity;

      let payment = await Payment.findOne({ payment_id: paymentObj.id });
      if (payment) {
        payment.set({
          entity: paymentObj.entity,
          amount: paymentObj.amount,
          currency: paymentObj.currency,
          status: paymentObj.status,
          order_id: paymentObj.order_id,
          invoice_id: paymentObj.invoice_id,
          international: paymentObj.international,
          method: paymentObj.method,
          amount_refunded: paymentObj.amount_refunded,
          amount_transferred: paymentObj.amount_transferred,
          refund_status: paymentObj.refund_status,
          captured: paymentObj.captured,
          description: paymentObj.description,
          card_id: paymentObj.card_id,
          bank: paymentObj.bank,
          wallet: paymentObj.wallet,
          vpa: paymentObj.vpa,
          email: paymentObj.email,
          contact: paymentObj.contact,
          error_code: paymentObj.error_code,
          error_description: paymentObj.error_description,
          error_source: paymentObj.error_source,
          error_step: paymentObj.error_step,
          error_reason: paymentObj.error_reason,
          created_at: paymentObj.created_at
        });
        await payment.save();
      } else {
        payment = Payment.build({
          payment_id: paymentObj.id,
          entity: paymentObj.entity,
          amount: paymentObj.amount,
          currency: paymentObj.currency,
          status: paymentObj.status,
          order_id: paymentObj.order_id,
          invoice_id: paymentObj.invoice_id,
          international: paymentObj.international,
          method: paymentObj.method,
          amount_refunded: paymentObj.amount_refunded,
          amount_transferred: paymentObj.amount_transferred,
          refund_status: paymentObj.refund_status,
          captured: paymentObj.captured,
          description: paymentObj.description,
          card_id: paymentObj.card_id,
          bank: paymentObj.bank,
          wallet: paymentObj.wallet,
          vpa: paymentObj.vpa,
          email: paymentObj.email,
          contact: paymentObj.contact,
          error_code: paymentObj.error_code,
          error_description: paymentObj.error_description,
          error_source: paymentObj.error_source,
          error_step: paymentObj.error_step,
          error_reason: paymentObj.error_reason,
          created_at: paymentObj.created_at
        });
        await payment.save();
      }

      let existingOrder = await Order.findOne({ order_id: req.body.payload.payment.entity.order_id });
      if (!existingOrder) {
        return;
      }

      //update Order Details
      existingOrder.set({
        status: OrderStatus.Paid,
      });
      await existingOrder.save();

      //Send Payment Complete
      new PaymentCompletedPublisher(natsWrapper.client).publish({
        productId: existingOrder.productId,
        payment_id: payment.payment_id,
        version: existingOrder.version,
        paymentMode: payment.method,
        arhOrderId: existingOrder.arhOrderId
      });
    }
  }
);

export { router as capturePaymentRouter };
