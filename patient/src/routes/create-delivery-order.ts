import express, { Request, Response } from 'express';
import { requirePatientAuth, BadRequestError, NotFoundError, OrderStatus, OrderType, ApiResponse } from '@unifycaredigital/aem';
import { CaseSheet } from '../models/case-sheet';
import { Appointment } from '../models/appointment-order';
import { DeliveryOrder } from '../models/delivery-order';
import { FixedPrice } from '../models/fixed-price';
import mongoose from 'mongoose';
import { Patient } from '../models/patient';

const router = express.Router();

router.get(
    '/api/patient/createdeliveryorder/:caseSheetId',
    requirePatientAuth,
    async (req: Request, res: Response) => {

        const caseSheetId = req.params.caseSheetId;

        let casesheet = await CaseSheet.findById(caseSheetId);
        if (!casesheet) {
            throw new BadRequestError("Case Sheet not found");
        }

        if (casesheet.parentId !== req.currentUser!.id) {
            throw new BadRequestError("Unauthorized to create new Order");
        }

        const appointment = await Appointment.findById(casesheet.appointmentId);
        if (!appointment) {
            throw new BadRequestError("Appointment not found");
        }

        const patient = await Patient.findById(appointment.customerId);
        if (!patient) {
            throw new BadRequestError("Patient Details not found");
        }


        let existingFixedPrice = await FixedPrice.findOne({});

        let medicineTotalAmountInINR = 0;
        for (let i = 0; i < casesheet.medicinePrescription.length; i++) {
            //calculate number of units
            let numberOfMedRequired = 0;
            const dose = casesheet.medicinePrescription[i].intakeFrequency.split('-');
            console.log('Dose = ' + dose)
            for (let j = 0; j < dose.length; j++) {
                numberOfMedRequired = numberOfMedRequired + Number(dose[j]);
            }

            console.log('numberOfMedRequired after dose ' + numberOfMedRequired);

            let durationInDays = casesheet.medicinePrescription[i].durationInDays;
            if (durationInDays == 0 || isNaN(durationInDays)) {
                durationInDays = 1;
            }
            numberOfMedRequired = numberOfMedRequired * durationInDays;

            console.log('numberOfMedRequired ' + casesheet.medicinePrescription[i].nameOfTheDrug + " = " + numberOfMedRequired);
            let numberOfUnits = 1;
            if (casesheet.medicinePrescription[i].medicineType === 'TABLET'
                || casesheet.medicinePrescription[i].medicineType === 'CAPSULE'
                || casesheet.medicinePrescription[i].medicineType === 'Tablet'
                || casesheet.medicinePrescription[i].medicineType === 'Capsule') {

                numberOfUnits = Math.floor(numberOfMedRequired /
                    Number(casesheet.medicinePrescription[i].packOf.match(/\d+/)![0]));

                if (numberOfMedRequired %
                    Number(casesheet.medicinePrescription[i].packOf.match(/\d+/)![0]) > 0) {
                    numberOfUnits = (numberOfUnits + 1)
                }
                if (numberOfUnits == 0) {
                    numberOfUnits = 1;
                }
            }
            medicineTotalAmountInINR = medicineTotalAmountInINR +
                casesheet.medicinePrescription[i].MRP * numberOfUnits;

            casesheet.medicinePrescription[i].numberOfUnits = numberOfUnits;
            casesheet = await casesheet.save();
            console.log('numberOfUnits ' + casesheet.medicinePrescription[i].nameOfTheDrug + " = " + casesheet.medicinePrescription[i].numberOfUnits);

        }

        let diagnosticTestTotalAmountInINR = 0;
        let addAdditionalCollectionCharge = false;
        for (let i = 0; i < casesheet.testPrescription.length; i++) {
            diagnosticTestTotalAmountInINR = diagnosticTestTotalAmountInINR +
                casesheet.testPrescription[i].cost;
            if (casesheet.testPrescription[i].addCollectionCharges) {
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
            if (addAdditionalCollectionCharge && casesheet.testPrescription.length > 1) {
                additionalHomeCollectionChargesInINR = existingFixedPrice.additionalHomeCollectionChargesInINR;
            }
        }

        const totalAmountInINR = medicineTotalAmountInINR + diagnosticTestTotalAmountInINR
            + shippingChargesInINR + homeCollectionChargesInINR + additionalHomeCollectionChargesInINR;


        let deliveryOrder = await DeliveryOrder.findOne({
            caseSheetId: caseSheetId,
            status: OrderStatus.Created
        })

        if (deliveryOrder) {
            deliveryOrder.set({
                medicinePrescription: casesheet.medicinePrescription,
                testPrescription: casesheet.testPrescription,
                medicineTotalAmountInINR: medicineTotalAmountInINR,
                diagnosticTestTotalAmountInINR: diagnosticTestTotalAmountInINR,
                shippingChargesInINR: shippingChargesInINR,
                homeCollectionChargesInINR: homeCollectionChargesInINR,
                additionalHomeCollectionChargesInINR: additionalHomeCollectionChargesInINR,
                discountOnMedicineInPercentage: discountOnMedicineInPercentage,
                discountOnDiagnosticTestInPercentage: discountOnDiagnosticTestInPercentage,
                totalAmountInINR: totalAmountInINR,
                deliveryAddress: patient.address,
                city: patient.city,
                state: patient.state,
                country: 'India',
                pincode: patient.pin,
                patientEmail: patient.emailId,
                patientPhone: patient.phoneNumber,
                nearByLandmark: '',
                addressType: '',
                orderDate: new Date(),
                orderType: OrderType.MedicineAndTestDelivery,
                medicineDeliveryEnabled: true,
                testCollectionEnabled: true,
                patientARHId: patient.mhrId
            });
            await deliveryOrder.save();
        } else {
            deliveryOrder = DeliveryOrder.build({
                id: new mongoose.Types.ObjectId().toHexString(),
                caseSheetId: casesheet.id!,
                appointmentDate: appointment.appointmentDate,
                appointmentSlotId: appointment.appointmentSlotId,
                patientId: appointment.customerId,
                parentId: appointment.parentId,
                patientName: appointment.customerName,
                patientFirstName: appointment.customerFirstName,
                patientLastName: appointment.customerLastName,
                patientAge: appointment.customerDateOfBirth,
                patientGender: appointment.customerGender,
                consultantId: appointment.consultantId,
                consultantName: appointment.consultantName,
                consultantQualification: String(appointment.consultantQualification),
                status: OrderStatus.Created,
                medicinePrescription: casesheet.medicinePrescription,
                testPrescription: casesheet.testPrescription,
                medicineTotalAmountInINR: medicineTotalAmountInINR,
                diagnosticTestTotalAmountInINR: diagnosticTestTotalAmountInINR,
                shippingChargesInINR: shippingChargesInINR,
                homeCollectionChargesInINR: homeCollectionChargesInINR,
                additionalHomeCollectionChargesInINR: additionalHomeCollectionChargesInINR,
                discountOnMedicineInPercentage: discountOnMedicineInPercentage,
                discountOnDiagnosticTestInPercentage: discountOnDiagnosticTestInPercentage,
                totalAmountInINR: totalAmountInINR,
                deliveryAddress: patient.address,
                city: patient.city,
                state: patient.state,
                country: 'India',
                pincode: patient.pin,
                patientEmail: patient.emailId,
                patientPhone: patient.phoneNumber,
                nearByLandmark: '',
                addressType: '',
                orderDate: new Date(),
                orderType: OrderType.MedicineAndTestDelivery,
                medicineDeliveryEnabled: true,
                testCollectionEnabled: true,
                patientARHId: patient.mhrId
            });
            await deliveryOrder.save();
        }
		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: deliveryOrder
		  }
        res.send(apiResponse);
    }
);

export { router as createDeliveryOrderRouter };
