import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PartnerInformationAttrs {
  id: string;
  partnerId: string;
  legalName: string;
  ownerOrganisationUID: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  status: boolean;
}

interface PartnerInformationDoc extends mongoose.Document {
  partnerId: string;
  legalName: string;
  ownerOrganisationUID: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  status: boolean;
}


interface PartnerInformationModel extends mongoose.Model<PartnerInformationDoc> {
  build(attrs: PartnerInformationAttrs): PartnerInformationDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PartnerInformationDoc | null>;
}

const partnerInformationSchema = new mongoose.Schema(
  {
    partnerId: {
      type: String,
      required: true
    },
    legalName: {
      type: String,
      required: true
    },
    ownerOrganisationUID: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      required: true
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
partnerInformationSchema.set('versionKey', 'version');
partnerInformationSchema.plugin(updateIfCurrentPlugin);

partnerInformationSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return PartnerInformation.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
partnerInformationSchema.static('build', (attrs: PartnerInformationAttrs) => {
  return new PartnerInformation({
    _id: attrs.id,
    partnerId: attrs.partnerId,
    legalName: attrs.legalName,
    ownerOrganisationUID: attrs.ownerOrganisationUID,
    addressLine1: attrs.addressLine1,
    addressLine2: attrs.addressLine2,
    city: attrs.city,
    state: attrs.state,
    country: attrs.country,
    pincode: attrs.pincode,
    status: attrs.status
  });
});

const PartnerInformation = mongoose.model<PartnerInformationDoc, PartnerInformationModel>('PartnerInformation', partnerInformationSchema);

export { PartnerInformation };
