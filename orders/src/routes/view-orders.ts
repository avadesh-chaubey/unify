import express, { Request, Response } from 'express';
import { requirePatientAuth } from '@unifycaredigital/aem';
import { Order } from '../models/order'

const router = express.Router();

router.get(
  '/api/order/all/:parentId',
  requirePatientAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({ parentId: req.params.parentId });
    const apiResponse = {
      status: 200,
      message: 'Success',
      data: orders
    }
    res.send(apiResponse);
   
  });

export { router as viewOrdersRouter };
