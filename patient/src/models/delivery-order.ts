import { OrderStatus, LabType, GenderType, OrderType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { MedicinePrescription, TestPrescription } from './case-sheet'

interface DeliveryOrderAttrs {
    id: string;
    caseSheetId: string;
    appointmentDate: string;
    appointmentSlotId: number;
    parentId: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientARHId: string;
    patientAge: string;
    patientGender: GenderType;
    consultantId: string;
    consultantName: string;
    consultantQualification: string;
    status: OrderStatus;
    medicinePrescription: [MedicinePrescription];
    testPrescription: [TestPrescription];
    medicineTotalAmountInINR: number;
    diagnosticTestTotalAmountInINR: number;
    shippingChargesInINR: number;
    homeCollectionChargesInINR: number;
    medicineDeliveryEnabled: boolean;
    testCollectionEnabled: boolean;
    additionalHomeCollectionChargesInINR: number;
    discountOnMedicineInPercentage: number;
    discountOnDiagnosticTestInPercentage: number;
    totalAmountInINR: number;
    deliveryAddress: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    nearByLandmark: string;
    addressType: string; //home office ..etc
    orderDate: Date;
    orderType: OrderType;
    patientFirstName: string;
    patientLastName: string;
}

export interface DeliveryOrderDoc extends mongoose.Document {
    caseSheetId: string;
    appointmentDate: string;
    appointmentSlotId: number;
    parentId: string;
    patientId: string;
    patientName: string;
    patientFirstName: string;
    patientLastName: string;
    patientEmail: string;
    patientPhone: string;
    patientARHId: string;
    patientAge: string;
    patientGender: GenderType;
    consultantId: string;
    consultantName: string;
    consultantQualification: string;
    status: OrderStatus;
    medicinePrescription: [MedicinePrescription];
    testPrescription: [TestPrescription];
    medicineTotalAmountInINR: number;
    diagnosticTestTotalAmountInINR: number;
    shippingChargesInINR: number;
    homeCollectionChargesInINR: number;
    additionalHomeCollectionChargesInINR: number;
    discountOnMedicineInPercentage: number;
    discountOnDiagnosticTestInPercentage: number;
    totalAmountInINR: number;
    deliveryAddress: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    nearByLandmark: string;
    addressType: string; //home office ..etc
    orderDate: Date;
    arhOrderId: number;
    orderType: OrderType;
    medicineDeliveryEnabled: boolean;
    testCollectionEnabled: boolean;
    paymentMode: string;
}

interface DeliveryOrderModel extends mongoose.Model<DeliveryOrderDoc> {
    build(attrs: DeliveryOrderAttrs): DeliveryOrderDoc;
    findByEvent(event: {
        id: string;
    }): Promise<DeliveryOrderDoc | null>;
}

const deliveryOrderSchema = new mongoose.Schema(
    {
        appointmentDate: {
            type: String,
            required: true
        },
        appointmentSlotId: {
            type: Number,
            required: true
        },
        caseSheetId: {
            type: String,
            required: true
        },
        parentId: {
            type: String,
            required: true
        },
        paymentMode: {
            type: String,
            required: false
        },
        patientName: {
            type: String,
            required: true
        },
        patientAge: {
            type: String,
            required: true
        },
        patientId: {
            type: String,
            required: true
        },
        consultantName: {
            type: String,
            required: true
        },
        patientGender: {
            type: GenderType,
            required: true
        },
        consultantQualification: {
            type: String,
            required: true
        },
        consultantId: {
            type: String,
            required: true
        },
        medicinePrescription: {
            type: [Object],
            required: true
        },
        testPrescription: {
            type: [Object],
            required: true
        },
        medicineTotalAmountInINR: {
            type: Number,
            required: false
        },
        diagnosticTestTotalAmountInINR: {
            type: Number,
            required: false
        },
        shippingChargesInINR: {
            type: Number,
            required: false
        },
        homeCollectionChargesInINR: {
            type: Number,
            required: false
        },
        additionalHomeCollectionChargesInINR: {
            type: Number,
            required: false
        },
        orderDate: {
            type: Date,
            required: false
        },
        arhOrderId: {
            type: Number,
            required: false
        },
        discountOnMedicineInPercentage: {
            type: Number,
            required: false
        },
        discountOnDiagnosticTestInPercentage: {
            type: Number,
            required: false
        },
        totalAmountInINR: {
            type: Number,
            required: false
        },
        deliveryAddress: {
            type: String,
            required: false,
            default: 'NA'
        },
        city: {
            type: String,
            required: false,
            default: 'NA'
        },
        state: {
            type: String,
            required: false,
            default: 'NA'
        },
        country: {
            type: String,
            default: 'India'
        },
        pincode: {
            type: String,
            required: false,
            default: 'NA'
        },
        nearByLandmark: {
            type: String,
        },
        addressType: {
            type: String,
        },
        status: {
            type: OrderStatus,
            required: true
        },
        orderType: {
            type: OrderType,
            required: true
        },
        medicineDeliveryEnabled: {
            type: Boolean,
            default: true
        },
        testCollectionEnabled: {
            type: Boolean,
            default: true
        },
        patientFirstName: {
            type: String,
            required: false,
        },
        patientLastName: {
            type: String,
            required: false,
            default: ""
        },
        patientEmail: {
            type: String,
            required: false,
            default: ""
        },
        patientPhone: {
            type: String,
            required: false,
            default: ""
        },
        patientARHId: {
            type: String,
            required: false,
            default: ""
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

deliveryOrderSchema.static('findByEvent', (event: { id: string }) => {
    return DeliveryOrder.findOne({
        _id: event.id
    });
});

deliveryOrderSchema.static('build', (attrs: DeliveryOrderAttrs) => {
    return new DeliveryOrder({
        _id: attrs.id,
        caseSheetId: attrs.caseSheetId,
        parentId: attrs.parentId,
        patientName: attrs.patientName,
        patientAge: attrs.patientAge,
        patientId: attrs.patientId,
        consultantName: attrs.consultantName,
        consultantQualification: attrs.consultantQualification,
        consultantId: attrs.consultantId,
        status: attrs.status,
        medicinePrescription: attrs.medicinePrescription,
        testPrescription: attrs.testPrescription,
        medicineTotalAmountInINR: attrs.medicineTotalAmountInINR,
        diagnosticTestTotalAmountInINR: attrs.diagnosticTestTotalAmountInINR,
        shippingChargesInINR: attrs.shippingChargesInINR,
        homeCollectionChargesInINR: attrs.homeCollectionChargesInINR,
        additionalHomeCollectionChargesInINR: attrs.additionalHomeCollectionChargesInINR,
        totalAmountInINR: attrs.totalAmountInINR,
        deliveryAddress: attrs.deliveryAddress,
        city: attrs.city,
        state: attrs.state,
        country: attrs.country,
        pincode: attrs.pincode,
        nearByLandmark: attrs.nearByLandmark,
        addressType: attrs.addressType,
        orderDate: attrs.orderDate,
        orderType: attrs.orderType,
        patientGender: attrs.patientGender,
        appointmentDate: attrs.appointmentDate,
        appointmentSlotId: attrs.appointmentSlotId,
        discountOnDiagnosticTestInPercentage: attrs.discountOnDiagnosticTestInPercentage,
        discountOnMedicineInPercentage: attrs.discountOnMedicineInPercentage,
        medicineDeliveryEnabled: attrs.medicineDeliveryEnabled,
        testCollectionEnabled: attrs.testCollectionEnabled,
        patientEmail: attrs.patientEmail,
        patientPhone: attrs.patientPhone,
        patientARHId: attrs.patientARHId
    });
});

const DeliveryOrder = mongoose.model<DeliveryOrderDoc, DeliveryOrderModel>('DeliveryOrder', deliveryOrderSchema);

export { DeliveryOrder };
