import express, { Request, Response } from 'express';
import { OrderType, requirePatientAuth, ApiResponse } from '@unifycaredigital/aem';
import { OrderHistory } from '../models/order-history';

const router = express.Router();

router.get('/api/patient/orderhistory', requirePatientAuth, async (req: Request, res: Response) => {
  const orderHistory = await OrderHistory.find({
    parentId: req.currentUser!.id,
  });

  let deliveryOrderHistory: any[] = [];
  orderHistory.forEach((item: any) => {
    if (item.orderType === OrderType.MedicineAndTestDelivery
      || item.orderType === OrderType.MedicineDelivery
      || item.orderType === OrderType.TestDelivery) {
      deliveryOrderHistory.push(item);
    }
  });

  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: deliveryOrderHistory
  }

  res.send(apiResponse);
});

export { router as showMyOrderHistoryRouter };
