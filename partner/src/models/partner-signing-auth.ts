import mongoose from 'mongoose';
import { DocumentStatus, KYCStatus, PartnerType } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface PartnerSigningAuthAttrs {
  id: string;
  superuserId: string;
  partnerType: PartnerType;
  partnerId: string;
  partnerSigningAuthStatus: KYCStatus;
  signingAuthName: string;
  signingAuthWorkEmail: string;
  signingAuthTaxId: string;
  signingAuthTaxIdUrl: string;
  signingAuthTaxIdStatus: DocumentStatus;
  signingAuthTitle: string;
  signingAuthLetterUrl: string;
  signingAuthLetterStatus: DocumentStatus;
}

interface PartnerSigningAuthDoc extends mongoose.Document {
  superuserId: string;
  partnerType: PartnerType;
  partnerId: string;
  partnerSigningAuthStatus: KYCStatus;
  signingAuthName: string;
  signingAuthWorkEmail: string;
  signingAuthTaxId: string;
  signingAuthTaxIdUrl: string;
  signingAuthTaxIdStatus: DocumentStatus;
  signingAuthTitle: string;
  signingAuthLetterUrl: string;
  signingAuthLetterStatus: DocumentStatus;
  version: number;
}


interface PartnerSigningAuthModel extends mongoose.Model<PartnerSigningAuthDoc> {
  build(attrs: PartnerSigningAuthAttrs): PartnerSigningAuthDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PartnerSigningAuthDoc | null>;
}

const partnerSigningAuthSchema = new mongoose.Schema(
  {
    partnerType: {
      type: PartnerType,
      required: true,
    },
    signingAuthName: {
      type: String,
      required: true,
    },
    partnerSigningAuthStatus: {
      type: KYCStatus,
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
    signingAuthWorkEmail: {
      type: String,
      required: true,
    },
    signingAuthTaxId: {
      type: String,
      required: true,
    },
    signingAuthTaxIdUrl: {
      type: String,
      required: true,
    },
    signingAuthTaxIdStatus: {
      type: DocumentStatus,
      required: true,
    },
    signingAuthTitle: {
      type: String,
      required: true,
    },
    signingAuthLetterUrl: {
      type: String,
      required: true,
    },
    signingAuthLetterStatus: {
      type: DocumentStatus,
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
partnerSigningAuthSchema.set('versionKey', 'version');
partnerSigningAuthSchema.plugin(updateIfCurrentPlugin);

partnerSigningAuthSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return PartnerSigningAuth.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
partnerSigningAuthSchema.static('build', (attrs: PartnerSigningAuthAttrs) => {
  return new PartnerSigningAuth({
    _id: attrs.id,
    superuserId: attrs.superuserId,
    partnerId: attrs.partnerId,
    partnerType: attrs.partnerType,
    partnerSigningAuthStatus: attrs.partnerSigningAuthStatus,
    signingAuthName: attrs.signingAuthName,
    signingAuthWorkEmail: attrs.signingAuthWorkEmail,
    signingAuthTaxId: attrs.signingAuthTaxId,
    signingAuthTaxIdUrl: attrs.signingAuthTaxIdUrl,
    signingAuthTaxIdStatus: attrs.signingAuthTaxIdStatus,
    signingAuthTitle: attrs.signingAuthTitle,
    signingAuthLetterUrl: attrs.signingAuthLetterUrl,
    signingAuthLetterStatus: attrs.signingAuthLetterStatus,
  });
});

const PartnerSigningAuth = mongoose.model<PartnerSigningAuthDoc, PartnerSigningAuthModel>('PartnerSigningAuth', partnerSigningAuthSchema);

export { PartnerSigningAuth };
