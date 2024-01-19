import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireRosterManagerAuth, ApiResponse } from '@unifycaredigital/aem';
import { FixedPrice } from '../models/fixed-price';

const router = express.Router();

router.post(
    '/api/patient/fixedprices',
    requireRosterManagerAuth,
    [
        body('shippingChargesInINR').not().isEmpty().withMessage('Shipping Charges must be provided'),
        body('homeCollectionChargesInINR').not().isEmpty().withMessage('Home Collection Charges must be provided'),
        body('additionalHomeCollectionChargesInINR').not().isEmpty().withMessage('Additional Home Collection Charges must be provided'),
        body('freeDeliveryOnMinimumAmountEnabled').not().isEmpty().withMessage('Free Delivery On Minimum Amount Enabled must be provided'),
        body('freeCollectionOnMinimumAmountEnabled').not().isEmpty().withMessage('Free Collection On Minimum Amount Enabled must be provided'),
        body('discountOnMedicineIsEnabled').not().isEmpty().withMessage('Discount On Medicine Is Enabled must be provided'),
        body('discountOnDiagnosticTestIsEnabled').not().isEmpty().withMessage('Discount On Diagnostic Test Is Enabled must be provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const {
            shippingChargesInINR,
            homeCollectionChargesInINR,
            additionalHomeCollectionChargesInINR,
            minimumOrderAmountForFreeDeliveryInINR,
            freeDeliveryOnMinimumAmountEnabled,
            minimumOrderAmountForFreeCollectionInINR,
            freeCollectionOnMinimumAmountEnabled,
            discountOnMedicineInPercentage,
            discountOnMedicineIsEnabled,
            discountOnDiagnosticTestInPercentage,
            discountOnDiagnosticTestIsEnabled,
            hospitalName,
            hospitalAddress,
            hospitalCity,
            hospitalState,
            hospitalPincode,
            hospitalPhoneNumber,
            hospitalEmail,
        } = req.body;


        let existingFixedPrice = await FixedPrice.findOne({});
        if (existingFixedPrice) {
            existingFixedPrice.set({
                shippingChargesInINR,
                homeCollectionChargesInINR,
                additionalHomeCollectionChargesInINR,
                minimumOrderAmountForFreeDeliveryInINR: minimumOrderAmountForFreeDeliveryInINR ? minimumOrderAmountForFreeDeliveryInINR : 0,
                freeDeliveryOnMinimumAmountEnabled,
                minimumOrderAmountForFreeCollectionInINR: minimumOrderAmountForFreeCollectionInINR ? minimumOrderAmountForFreeCollectionInINR : 0,
                freeCollectionOnMinimumAmountEnabled,
                discountOnMedicineInPercentage: discountOnMedicineInPercentage ? discountOnMedicineInPercentage : 0,
                discountOnMedicineIsEnabled,
                discountOnDiagnosticTestInPercentage: discountOnDiagnosticTestInPercentage ? discountOnDiagnosticTestInPercentage : 0,
                discountOnDiagnosticTestIsEnabled,
                lastUpdatedOn: new Date(),
                hospitalName: hospitalName ? hospitalName : existingFixedPrice.hospitalName,
                hospitalAddress: hospitalAddress ? hospitalAddress : existingFixedPrice.hospitalAddress,
                hospitalCity: hospitalCity ? hospitalCity : existingFixedPrice.hospitalCity,
                hospitalState: hospitalState ? hospitalState : existingFixedPrice.hospitalState,
                hospitalPincode: hospitalPincode ? hospitalPincode : existingFixedPrice.hospitalPincode,
                hospitalPhoneNumber: hospitalPhoneNumber ? hospitalPhoneNumber : existingFixedPrice.hospitalPhoneNumber,
                hospitalEmail: hospitalEmail ? hospitalEmail : existingFixedPrice.hospitalEmail,
            });
            await existingFixedPrice.save();
        }
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: existingFixedPrice!
		}
        res.send(apiResponse);
    }
);

export { router as updateFixedPriceRouter };
