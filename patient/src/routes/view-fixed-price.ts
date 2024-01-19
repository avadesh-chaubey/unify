import express, { Request, Response } from 'express';
import { NotFoundError, requireRosterManagerAuth,ApiResponse } from '@unifycaredigital/aem';
import { FixedPrice } from '../models/fixed-price';

const router = express.Router();

router.get(
    '/api/patient/fixedprices',
    requireRosterManagerAuth,
    async (req: Request, res: Response) => {

        const existingFixedPrice = await FixedPrice.findOne({});
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

export { router as viewFixedPriceRouter };
