import express, { Request, Response } from 'express';
import { requirePatientAuth, ApiResponse } from '@unifycaredigital/aem';
import { DeliveryOrder } from '../models/delivery-order';

const router = express.Router();

router.get('/api/patient/deliveryorder/:id', requirePatientAuth, async (req: Request, res: Response) => {
  const deliveryOrder = await DeliveryOrder.findById(req.params.id);
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: deliveryOrder!
  }
  res.send(apiResponse);
});

export { router as showDeliveryOrderRouter };
