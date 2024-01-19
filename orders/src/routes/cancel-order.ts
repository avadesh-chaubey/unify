import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requirePatientAuth, NotFoundError, OrderStatus, BadRequestError } from '@unifycaredigital/aem';
import { Order } from '../models/order';
import mongoose from 'mongoose';
const router = express.Router();

router.post(
    '/api/order/cancel',
    requirePatientAuth,
    [
        body('productId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Product Id must be provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        let order = await Order.findOne({ productId: req.body.productId });
        if (!order) {
            throw new BadRequestError("Order Does Not Exist.");
        }

        if (order.status === OrderStatus.Paid) {
            console.log("Initiate Cancellation Workflow for Paid Order ")
        }

        order.set({
            status: OrderStatus.Cancelled,
        });
        await order.save();
        const apiResponse = {
            status: 200,
            message: 'Success',
            data: order
          }
          res.send(apiResponse);
       
    }
);

export { router as cancelOrderRouter };
