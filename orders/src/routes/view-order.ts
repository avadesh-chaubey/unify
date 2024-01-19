import express, { Request, Response } from 'express';
import { requirePatientAuth } from '@unifycaredigital/aem';
import { Order } from '../models/order'

const router = express.Router();

router.get(
  '/api/order/:id',
  requirePatientAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    const apiResponse = {
      status: 200,
      message: 'Success',
      data: order
    }
    res.send(apiResponse);
 
  });

export { router as viewOrderRouter };
