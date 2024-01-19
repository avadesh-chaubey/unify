import express, { Request, Response } from 'express';
import { requirePatientAuth, NotFoundError, OrderType,ApiResponse } from '@unifycaredigital/aem';
import { FixedPrice } from '../models/fixed-price';
import { DeliveryOrder } from '../models/delivery-order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Patient } from '../models/patient';


const router = express.Router();

const DEFAULT_EXPIRATION_WINDOW_SECONDS = 10 * 60;

router.post(
    '/api/patient/paydeliveryorder',

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

        let medicineTotalAmountInINR = 0.00;
        for (let i = 0; i < medicinePrescription.length; i++) {
            //calculate Number of units

            medicineTotalAmountInINR = medicineTotalAmountInINR +
                medicinePrescription[i].MRP * medicinePrescription[i].numberOfUnits;
        }

        medicineTotalAmountInINR = Number(medicineTotalAmountInINR.toFixed(2));


        let diagnosticTestTotalAmountInINR = 0.00;
        let addAdditionalCollectionCharge = false;
        for (let i = 0; i < testPrescription.length; i++) {
            if (testPrescription[i].serviceType !== null) {
                diagnosticTestTotalAmountInINR = diagnosticTestTotalAmountInINR +
                    testPrescription[i].cost;
                if (testPrescription[i].addCollectionCharges) {
                    addAdditionalCollectionCharge = true;
                }
            }
        }

        diagnosticTestTotalAmountInINR = Number(diagnosticTestTotalAmountInINR.toFixed(2));

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

        let totalAmountInINR = medicineTotalAmountInINR + diagnosticTestTotalAmountInINR
            + shippingChargesInINR + homeCollectionChargesInINR + additionalHomeCollectionChargesInINR;

        totalAmountInINR = Number(totalAmountInINR.toFixed(2));

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
            orderDate: new Date(),
            medicineDeliveryEnabled: medicineDeliveryEnabled,
            testCollectionEnabled: testCollectionEnabled,
            orderType: orderType
        });
        await deliveryOrder.save();

        const patient = await Patient.findById(deliveryOrder.patientId);
        if (patient) {
            patient.set({
                address: deliveryAddress,
                city: city,
                state: state,
                pin: pincode,
            });
            await patient.save()
        }

        if (sendOrderMessage) {

            const expiration = new Date();
            expiration.setSeconds(expiration.getSeconds() + DEFAULT_EXPIRATION_WINDOW_SECONDS);
            console.log('orderType ' + orderType + ' Price ' + totalAmountInINR);

            ///// Publish New Appointment Message //////////////
            new OrderCreatedPublisher(natsWrapper.client).publish({
                productId: deliveryOrder.id!,
                expirationDate: expiration,
                priceInINR: deliveryOrder.totalAmountInINR,
                patientId: deliveryOrder.patientId,
                parentId: deliveryOrder.parentId,
                status: deliveryOrder.status,
                numberOfRetry: 0,
                orderType: deliveryOrder.orderType,
                version: 1
            });
        }
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: deliveryOrder
		}
        res.send(apiResponse);
    }
);

export { router as payDeliveryOrderRouter };
