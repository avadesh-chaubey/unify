import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError } from '@unifycaredigital/aem';
import { Order } from '../models/order'

const router = express.Router();

router.get(
  '/api/order/mockpayment/:id',
  requireAuth,
  async (req: Request, res: Response) => {

    if (process.env.MOCK_PAYMENT_KEY) {
      console.log("Mock Capture Webhook Called");

      let existingOrder = await Order.findOne({ order_id: req.params.id });
      if (!existingOrder) {
        throw new BadRequestError("Payment not found for payment id = " + req.params.id);
      }
      const apiResponse = {
        status: 200,
        message: 'Success',
        data: "Successful"
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
  });

export { router as viewMockPaymentRouter };
