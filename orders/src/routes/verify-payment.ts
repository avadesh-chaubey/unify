import express, { Request, Response } from 'express';
import { requirePatientAuth } from '@unifycaredigital/aem';
import { Payment } from '../models/payment'

const router = express.Router();

router.get(
  '/api/order/payment/:id',
  requirePatientAuth,
  async (req: Request, res: Response) => {
    const payment = await Payment.findOne({ payment_id: req.params.id });
    const apiResponse = {
      status: 200,
      message: 'Success',
      data: payment
    }
    res.send(apiResponse);
    
  });

export { router as viewPaymentRouter };
