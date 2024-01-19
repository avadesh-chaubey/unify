import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth, NotFoundError, ApiResponse } from '@unifycaredigital/aem';
import { FixedPrice } from '../models/fixed-price';
import mongoose from 'mongoose';

const router = express.Router();

router.get(
    '/api/patient/fixedprices',
    requireAuth,
    async (req: Request, res: Response) => {

        let existingFixedPrice = await FixedPrice.findOne({});
        if (!existingFixedPrice) {
            throw new NotFoundError();
        }
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: existingFixedPrice
		}
        res.send(apiResponse);
    }
);

export { router as showFixedPriceRouter };
