import mongoose from 'mongoose';
import { DocumentStatus, PartnerType, KYCStatus } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface PartnerBankDetailsAttrs {
  id: string;
  superuserId: string;
  partnerType: PartnerType;
  partnerId: string;
  bankAccountName: string;
  bankAccountType: string;
  bankAccountNumber: string;
  bankIFSCCode: string;
  bankName: string;
  bankChequeURL: string;
  bankChequeStatus: DocumentStatus;
  partnerBankDetailsStatus: KYCStatus;
}

interface PartnerBankDetailsDoc extends mongoose.Document {
  superuserId: string;
  partnerType: PartnerType;
  partnerId: string;
  bankAccountName: string;
  bankAccountType: string;
  bankAccountNumber: string;
  bankIFSCCode: string;
  bankName: string;
  bankChequeURL: string;
  bankChequeStatus: DocumentStatus;
  partnerBankDetailsStatus: KYCStatus;
  version: number;
}


interface PartnerBankDetailsModel extends mongoose.Model<PartnerBankDetailsDoc> {
  build(attrs: PartnerBankDetailsAttrs): PartnerBankDetailsDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PartnerBankDetailsDoc | null>;
}

const partnerBankDetailsSchema = new mongoose.Schema(
  {
    partnerType: {
      type: PartnerType,
      required: true,
    },
    superuserId: {
      type: String,
      required: true,
    },
    partnerId: {
      type: String,
      required: true,
    },
    bankAccountName: {
      type: String,
      required: true,
    },
	bankAccountType: {
		type: String,
		required: true,
		default: "CURRENT"
	},
    bankAccountNumber: {
      type: String,
      required: true,
    },
    bankIFSCCode: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    bankChequeURL: {
      type: String,
      required: true,
    },
    bankChequeStatus: {
      type: DocumentStatus,
      required: true,
    },
    partnerBankDetailsStatus: {
      type: KYCStatus,
      required: true,
    }
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
partnerBankDetailsSchema.set('versionKey', 'version');
partnerBankDetailsSchema.plugin(updateIfCurrentPlugin);

partnerBankDetailsSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return PartnerBankDetails.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
partnerBankDetailsSchema.static('build', (attrs: PartnerBankDetailsAttrs) => {
  return new PartnerBankDetails({
    _id: attrs.id,
    superuserId: attrs.superuserId,
    partnerId: attrs.partnerId,
    partnerType: attrs.partnerType,
    bankAccountName: attrs.bankAccountName,
	bankAccountType: attrs.bankAccountType,
    bankAccountNumber: attrs.bankAccountNumber,
    bankIFSCCode: attrs.bankIFSCCode,
    bankName: attrs.bankName,
    bankChequeURL: attrs.bankChequeURL,
    bankChequeStatus: attrs.bankChequeStatus,
    partnerBankDetailsStatus: attrs.partnerBankDetailsStatus,
  });
});

const PartnerBankDetails = mongoose.model<PartnerBankDetailsDoc, PartnerBankDetailsModel>('PartnerBankDetails', partnerBankDetailsSchema);

export { PartnerBankDetails };
