import express, { Request, Response } from 'express';
import { requirePatientAuth, NotFoundError, OrderType, ApiResponse } from '@unifycaredigital/aem';
import { FixedPrice } from '../models/fixed-price';
import { DeliveryOrder } from '../models/delivery-order';


const router = express.Router();

const DEFAULT_EXPIRATION_WINDOW_SECONDS = 10 * 60;

router.post(
    '/api/patient/updatedeliveryorder',

    requirePatientAuth,
    async (req: Request, res: Response) => {

        const { id,
            medicinePrescription,
            testPrescription,
            deliveryAddress,
            city,
            state,
            pincode,
            addressType,
            medicineDeliveryEnabled,
            testCollectionEnabled,
        } = req.body;

        const sendOrderMessage = true;

        const deliveryOrder = await DeliveryOrder.findById(id);
        if (!deliveryOrder) {
            throw new NotFoundError();
        }

        let existingFixedPrice = await FixedPrice.findOne({});

        let medicineTotalAmountInINR = 0;
        for (let i = 0; i < medicinePrescription.length; i++) {
            //calculate Number of units

            medicineTotalAmountInINR = medicineTotalAmountInINR +
                medicinePrescription[i].MRP * medicinePrescription[i].numberOfUnits;
        }

        let diagnosticTestTotalAmountInINR = 0;
        let addAdditionalCollectionCharge = false;
        for (let i = 0; i < testPrescription.length; i++) {
            diagnosticTestTotalAmountInINR = diagnosticTestTotalAmountInINR +
                testPrescription[i].cost;
            if (testPrescription[i].addCollectionCharges) {
                addAdditionalCollectionCharge = true;
            }
        }

        let shippingChargesInINR = 0;
        let homeCollectionChargesInINR = 0;
        let additionalHomeCollectionChargesInINR = 0;
        let discountOnMedicineInPercentage = 0;
        let discountOnDiagnosticTestInPercentage = 0;
        if (existingFixedPrice) {
            if (existingFixedPrice.discountOnMedicineIsEnabled) {
                discountOnMedicineInPercentage = existingFixedPrice.discountOnMedicineInPercentage;
                medicineTotalAmountInINR = (medicineTotalAmountInINR
                    - ((medicineTotalAmountInINR * existingFixedPrice.discountOnMedicineInPercentage) / 100))
            }

            if (existingFixedPrice.freeDeliveryOnMinimumAmountEnabled &&
                medicineTotalAmountInINR >= existingFixedPrice.minimumOrderAmountForFreeDeliveryInINR) {
                shippingChargesInINR = 0;
            } else {
                shippingChargesInINR = existingFixedPrice.shippingChargesInINR;
            }

            if (existingFixedPrice.discountOnDiagnosticTestIsEnabled) {
                discountOnDiagnosticTestInPercentage = existingFixedPrice.discountOnDiagnosticTestInPercentage;
                diagnosticTestTotalAmountInINR = (diagnosticTestTotalAmountInINR
                    - ((diagnosticTestTotalAmountInINR * existingFixedPrice.discountOnDiagnosticTestInPercentage) / 100))
            }

            if (existingFixedPrice.freeCollectionOnMinimumAmountEnabled &&
                diagnosticTestTotalAmountInINR >= existingFixedPrice.minimumOrderAmountForFreeCollectionInINR) {
                homeCollectionChargesInINR = 0;
            } else {
                homeCollectionChargesInINR = existingFixedPrice.homeCollectionChargesInINR;
            }
            if (addAdditionalCollectionCharge && testPrescription.length > 1) {
                additionalHomeCollectionChargesInINR = existingFixedPrice.additionalHomeCollectionChargesInINR;
            }
        }

        let orderType = OrderType.MedicineAndTestDelivery;


        if (!medicineDeliveryEnabled
            || medicinePrescription.length <= 0
            || medicineTotalAmountInINR == 0) {
            medicineTotalAmountInINR = 0;
            shippingChargesInINR = 0;
            orderType = OrderType.TestDelivery;
        }
        if (!testCollectionEnabled
            || testPrescription.length <= 0
            || diagnosticTestTotalAmountInINR == 0) {
            diagnosticTestTotalAmountInINR = 0;
            homeCollectionChargesInINR = 0;
            additionalHomeCollectionChargesInINR = 0;
            orderType = OrderType.MedicineDelivery;
        }

        const totalAmountInINR = medicineTotalAmountInINR + diagnosticTestTotalAmountInINR
            + shippingChargesInINR + homeCollectionChargesInINR + additionalHomeCollectionChargesInINR;

        deliveryOrder.set({
            medicinePrescription: medicinePrescription,
            testPrescription: testPrescription,
            medicineTotalAmountInINR: medicineTotalAmountInINR,
            diagnosticTestTotalAmountInINR: diagnosticTestTotalAmountInINR,
            shippingChargesInINR: shippingChargesInINR,
            homeCollectionChargesInINR: homeCollectionChargesInINR,
            additionalHomeCollectionChargesInINR: additionalHomeCollectionChargesInINR,
            discountOnMedicineInPercentage: discountOnMedicineInPercentage,
            discountOnDiagnosticTestInPercentage: discountOnDiagnosticTestInPercentage,
            totalAmountInINR: totalAmountInINR,
            deliveryAddress: deliveryAddress,
            city: city,
            state: state,
            pincode: pincode,
            addressType: addressType,
            medicineDeliveryEnabled: medicineDeliveryEnabled,
            testCollectionEnabled: testCollectionEnabled,
            orderType: orderType
        });
        await deliveryOrder.save();

		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: deliveryOrder
		}
        res.status(200).send(apiResponse);
    }
);

export { router as updateDeliveryOrderRouter };
