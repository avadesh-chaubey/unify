import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface FixedPriceAttrs {
    id: string;
    shippingChargesInINR: number;
    homeCollectionChargesInINR: number;
    additionalHomeCollectionChargesInINR: number;
    minimumOrderAmountForFreeDeliveryInINR: number;
    freeDeliveryOnMinimumAmountEnabled: boolean;
    minimumOrderAmountForFreeCollectionInINR: number;
    freeCollectionOnMinimumAmountEnabled: boolean;
    discountOnMedicineInPercentage: number;
    discountOnMedicineIsEnabled: boolean;
    discountOnDiagnosticTestInPercentage: number;
    discountOnDiagnosticTestIsEnabled: boolean;
    lastUpdatedOn: Date;
    hospitalName: string;
    hospitalAddress: string;
    hospitalCity: string;
    hospitalState: string;
    hospitalPincode: string;
    hospitalPhoneNumber: string;
    hospitalEmail: string;
}

interface FixedPriceDoc extends mongoose.Document {
    shippingChargesInINR: number;
    homeCollectionChargesInINR: number;
    additionalHomeCollectionChargesInINR: number;
    minimumOrderAmountForFreeDeliveryInINR: number;
    freeDeliveryOnMinimumAmountEnabled: boolean;
    minimumOrderAmountForFreeCollectionInINR: number;
    freeCollectionOnMinimumAmountEnabled: boolean;
    discountOnMedicineInPercentage: number;
    discountOnMedicineIsEnabled: boolean;
    discountOnDiagnosticTestInPercentage: number;
    discountOnDiagnosticTestIsEnabled: boolean;
    lastUpdatedOn: Date;
    hospitalName: string;
    hospitalAddress: string;
    hospitalCity: string;
    hospitalState: string;
    hospitalPincode: string;
    hospitalPhoneNumber: string;
    hospitalEmail: string;
    version: number;
}

interface FixedPriceModel extends mongoose.Model<FixedPriceDoc> {
    build(attrs: FixedPriceAttrs): FixedPriceDoc;
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<FixedPriceDoc | null>;
}

const fixedPriceSchema = new mongoose.Schema(
    {
        minimumOrderAmountForFreeCollectionInINR: {
            type: Number,
            required: true
        },
        freeCollectionOnMinimumAmountEnabled: {
            type: Boolean,
            required: false,
            default: false
        },
        discountOnMedicineInPercentage: {
            type: Number,
            required: true
        },
        discountOnMedicineIsEnabled: {
            type: Boolean,
            required: false,
            default: false
        },
        discountOnDiagnosticTestInPercentage: {
            type: Number,
            required: true
        },
        discountOnDiagnosticTestIsEnabled: {
            type: Boolean,
            required: false,
            default: false
        },
        shippingChargesInINR: {
            type: Number,
            required: true
        },
        homeCollectionChargesInINR: {
            type: Number,
            required: true
        },
        additionalHomeCollectionChargesInINR: {
            type: Number,
            required: true
        },
        minimumOrderAmountForFreeDeliveryInINR: {
            type: Number,
            required: true
        },
        freeDeliveryOnMinimumAmountEnabled: {
            type: Boolean,
            required: false,
            default: false
        },
        lastUpdatedOn: {
            type: Date,
            required: true
        },
        hospitalName: {
            type: String,
            required: false,
            default: ""
        },
        hospitalAddress: {
            type: String,
            required: false,
            default: ""
        },
        hospitalCity: {
            type: String,
            required: false,
            default: ""
        },
        hospitalState: {
            type: String,
            required: false,
            default: ""
        },
        hospitalPincode: {
            type: String,
            required: false,
            default: ""
        },
        hospitalPhoneNumber: {
            type: String,
            required: false,
            default: ""
        },
        hospitalEmail: {
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
fixedPriceSchema.set('versionKey', 'version');
fixedPriceSchema.plugin(updateIfCurrentPlugin);

fixedPriceSchema.static('findByEvent', (event: { id: string, version: number }) => {
    return FixedPrice.findOne({
        _id: event.id,
        version: event.version - 1,
    });
});

fixedPriceSchema.static('build', (attrs: FixedPriceAttrs) => {
    return new FixedPrice({
        _id: attrs.id,
        shippingChargesInINR: attrs.shippingChargesInINR,
        homeCollectionChargesInINR: attrs.homeCollectionChargesInINR,
        additionalHomeCollectionChargesInINR: attrs.additionalHomeCollectionChargesInINR,
        minimumOrderAmountForFreeDeliveryInINR: attrs.minimumOrderAmountForFreeDeliveryInINR,
        freeDeliveryOnMinimumAmountEnabled: attrs.freeDeliveryOnMinimumAmountEnabled,
        lastUpdatedOn: attrs.lastUpdatedOn,
        minimumOrderAmountForFreeCollectionInINR: attrs.minimumOrderAmountForFreeCollectionInINR,
        freeCollectionOnMinimumAmountEnabled: attrs.freeCollectionOnMinimumAmountEnabled,
        discountOnMedicineInPercentage: attrs.discountOnMedicineInPercentage,
        discountOnMedicineIsEnabled: attrs.discountOnMedicineIsEnabled,
        discountOnDiagnosticTestInPercentage: attrs.discountOnDiagnosticTestInPercentage,
        discountOnDiagnosticTestIsEnabled: attrs.discountOnDiagnosticTestIsEnabled,
        hospitalName: attrs.hospitalName,
        hospitalAddress: attrs.hospitalAddress,
        hospitalCity: attrs.hospitalCity,
        hospitalState: attrs.hospitalState,
        hospitalPincode: attrs.hospitalPincode,
        hospitalPhoneNumber: attrs.hospitalPhoneNumber,
        hospitalEmail: attrs.hospitalEmail,
    });
});

const FixedPrice = mongoose.model<FixedPriceDoc, FixedPriceModel>('FixedPrice', fixedPriceSchema);

export { FixedPrice };
