import express, { Request, Response } from 'express';
import { requirePatientAuth, ApiResponse } from '@unifycaredigital/aem';
import { OrderHistory } from '../models/order-history';

const router = express.Router();

router.get('/api/patient/familyorderhistory/:id', requirePatientAuth, async (req: Request, res: Response) => {
  const orderHistory = await OrderHistory.find({
    parentId: req.currentUser!.id,
    patientId: req.params.id
  });
  const apiResponse: ApiResponse = {
    status: 200,
    message: 'Success',
    data: orderHistory
  }
  res.send(apiResponse);
});

export { router as showFamilyMemberOrderHistoryRouter };
