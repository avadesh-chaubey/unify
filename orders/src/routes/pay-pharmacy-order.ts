import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requirePatientAuth, BadRequestError, OrderStatus, NotAuthorizedError, InternalServerError, OrderType } from '@unifycaredigital/aem';
import { Order } from '../models/order';
import mongoose from 'mongoose';
import { pharmacyRazorpay } from '../razorpay';
import { PaymentCompletedPublisher } from '../events/publishers/payment-completed-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/order/paypharmacy',
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

        let existingOrder = await Order.findOne({ productId: req.body.productId });
        if (!existingOrder) {
            throw new BadRequestError("Order Does Not Exist.");
        }

        if (existingOrder.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Cannot initiate payment for cancelled/expired order.");
        }


        if (existingOrder.parentId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (existingOrder.orderType === OrderType.FreeAppointment) {
            existingOrder.set({
                status: OrderStatus.Paid,
                order_id: 'NA',
            });
            await existingOrder.save();

            //Send Payment Complete
            new PaymentCompletedPublisher(natsWrapper.client).publish({
                productId: existingOrder.productId,
                payment_id: 'NA',
                version: existingOrder.version,
                arhOrderId: existingOrder.arhOrderId,
                paymentMode: 'FREE'
            });
        } else {

            const options = {
                amount: Math.floor(existingOrder.priceInINR * 100),
                currency: existingOrder.currency,
                receipt: existingOrder.receipt
            };
            let order_id = 'NA';

            try {
                await pharmacyRazorpay.orders.create(options, function (err: any, order: any) {
                    if (err) {
                        req.errorlog(err);
                        console.log(err);
                        throw new InternalServerError();
                    }
                    order_id = order.id;
                });

            } catch (error) {
                console.log(error);
            }

            existingOrder.set({
                status: OrderStatus.AwaitingPayment,
                order_id: order_id,
            });
            await existingOrder.save();
        }
        const apiResponse = {
            status: 200,
            message: 'Success',
            data: existingOrder
          }
          res.send(apiResponse);
        
          
    }
);

export { router as payPharmacyOrderRouter };
