import mongoose from 'mongoose';
import { DocumentStatus, KYCStatus, PartnerType } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface PartnerInfoAttrs {
  id: string;
  ownerOrganisationUID: string;
  superuserId: string;
  partnerType: PartnerType;
  partnerId: string;
  legalName: string;
  website: string;
  services: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  corporateId: string;
  corporateIdUrl: string;
  corporateIdStatus: DocumentStatus;
  corporateTaxId: string;
  corporateTaxIdUrl: string;
  corporateTaxIdStatus: DocumentStatus;
  goodsAndServicesTaxId: string;
  goodsAndServicesTaxIdUrl: string;
  goodsAndServicesTaxIdStatus: DocumentStatus;
  partnerInfoStatus: KYCStatus;
  phoneNumber: string;
  tollFreeNumber: string;
  status: boolean;
}

interface PartnerInfoDoc extends mongoose.Document {
  ownerOrganisationUID: string;
  superuserId: string;
  partnerType: PartnerType;
  partnerId: string;
  legalName: string;
  website: string;
  services: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  corporateId: string;
  corporateIdUrl: string;
  corporateIdStatus: DocumentStatus;
  corporateTaxId: string;
  corporateTaxIdUrl: string;
  corporateTaxIdStatus: DocumentStatus;
  goodsAndServicesTaxId: string;
  goodsAndServicesTaxIdUrl: string;
  goodsAndServicesTaxIdStatus: DocumentStatus;
  partnerInfoStatus: KYCStatus;
  phoneNumber: string;
  tollFreeNumber: string;
  version: number;
  status: boolean;
}


interface PartnerInfoModel extends mongoose.Model<PartnerInfoDoc> {
  build(attrs: PartnerInfoAttrs): PartnerInfoDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PartnerInfoDoc | null>;
}

const partnerInfoSchema = new mongoose.Schema(
  {
    partnerType: {
      type: PartnerType,
      required: true,
    },
    ownerOrganisationUID: {
      type: String,
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
    legalName: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    services: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    corporateId: {
      type: String,
      required: true,
    },
    corporateIdUrl: {
      type: String,
      required: true,
    },
    corporateIdStatus: {
      type: DocumentStatus,
      required: true,
    },
    corporateTaxId: {
      type: String,
      required: true,
    },
    corporateTaxIdUrl: {
      type: String,
      required: true,
    },
    corporateTaxIdStatus: {
      type: DocumentStatus,
      required: true,
    },
    goodsAndServicesTaxId: {
      type: String,
      required: true,
    },
    goodsAndServicesTaxIdUrl: {
      type: String,
      required: true,
    },
    goodsAndServicesTaxIdStatus: {
      type: DocumentStatus,
      required: true,
    },
    partnerInfoStatus: {
      type: KYCStatus,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true
    },
    tollFreeNumber: {
      type: String,
      required: false,
      default: ""
    },
    status: {
      type: Boolean,
      required: true,
      default: true
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
partnerInfoSchema.set('versionKey', 'version');
partnerInfoSchema.plugin(updateIfCurrentPlugin);

partnerInfoSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return PartnerInfo.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
partnerInfoSchema.static('build', (attrs: PartnerInfoAttrs) => {
  return new PartnerInfo({
    _id: attrs.id,
    ownerOrganisationUID: attrs.ownerOrganisationUID,
    superuserId: attrs.superuserId,
    partnerType: attrs.partnerType,
    partnerId: attrs.partnerId,
    legalName: attrs.legalName,
    website: attrs.website,
    services: attrs.services,
    addressLine1: attrs.addressLine1,
    addressLine2: attrs.addressLine2,
    city: attrs.city,
    state: attrs.state,
    country: attrs.country,
    pincode: attrs.pincode,
    corporateId: attrs.corporateId,
    corporateIdUrl: attrs.corporateIdUrl,
    corporateIdStatus: attrs.corporateIdStatus,
    corporateTaxId: attrs.corporateTaxId,
    corporateTaxIdUrl: attrs.corporateTaxIdUrl,
    corporateTaxIdStatus: attrs.corporateTaxIdStatus,
    goodsAndServicesTaxId: attrs.goodsAndServicesTaxId,
    goodsAndServicesTaxIdUrl: attrs.goodsAndServicesTaxIdUrl,
    goodsAndServicesTaxIdStatus: attrs.goodsAndServicesTaxIdStatus,
    partnerInfoStatus: attrs.partnerInfoStatus,
    phoneNumber: attrs.phoneNumber,
    tollFreeNumber: attrs.tollFreeNumber,
    status: attrs.status
  });
});

const PartnerInfo = mongoose.model<PartnerInfoDoc, PartnerInfoModel>('PartnerInfo', partnerInfoSchema);

export { PartnerInfo };
