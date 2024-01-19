import express, { Request, Response } from 'express';
import {
  OrderStatus,
  BadRequestError,
} from '@unifycaredigital/aem';
import { Order } from '../models/order';
import { PaymentCompletedPublisher } from '../events/publishers/payment-completed-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/order/capturemockpayment',
  async (req: Request, res: Response) => {

    const { order_id, mock_key } = req.body;

    if (process.env.MOCK_PAYMENT_KEY) {
      console.log("Mock Capture Webhook Called");

      if (mock_key !== process.env.MOCK_PAYMENT_KEY.toString()) {
        throw new BadRequestError("Key Not matching")
      }

      const existingOrder = await Order.findOne({ order_id: order_id });
      if (!existingOrder) {
        throw new BadRequestError("Order not found for order_id = " + order_id);
      }

      //update Order Details
      existingOrder.set({
        status: OrderStatus.Paid,
      });
      await existingOrder.save();

      //Send Payment Complete
      new PaymentCompletedPublisher(natsWrapper.client).publish({
        productId: existingOrder.productId,
        payment_id: order_id,
        version: existingOrder.version,
        paymentMode: 'mock',
        arhOrderId: existingOrder.arhOrderId
      });
      const apiResponse = {
        status: 200,
        message: 'Success',
        data:"Successful" 
      }
      res.send(apiResponse);
     
    } else {
      const apiResponse = {
        status: 200,
        message: 'Success',
        data: "Bad Request"
      }
      res.send(apiResponse);
    
    }
  }
);

export { router as mockCapturePaymentRouter };
