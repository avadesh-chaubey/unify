import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface PartnerLogoInfoAttrs {
  id: string;
  partnerId: string;
  logoUrl: string;
  prescriptionUrl: string;
}

interface PartnerLogoInfoDoc extends mongoose.Document {
  partnerId: string;
  logoUrl: string;
  prescriptionUrl: string;
}


interface PartnerLogoInfoModel extends mongoose.Model<PartnerLogoInfoDoc> {
  build(attrs: PartnerLogoInfoAttrs): PartnerLogoInfoDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PartnerLogoInfoDoc | null>;
}

const partnerLogoInfoSchema = new mongoose.Schema(
  {
    partnerId: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    prescriptionUrl: {
      type: String,
      required: true,
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
partnerLogoInfoSchema.set('versionKey', 'version');
partnerLogoInfoSchema.plugin(updateIfCurrentPlugin);

partnerLogoInfoSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return PartnerLogoInfo.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
partnerLogoInfoSchema.static('build', (attrs: PartnerLogoInfoAttrs) => {
  return new PartnerLogoInfo({
    _id: attrs.id,
    partnerId: attrs.partnerId,
    logoUrl: attrs.logoUrl,
    prescriptionUrl: attrs.prescriptionUrl,
  });
});

const PartnerLogoInfo = mongoose.model<PartnerLogoInfoDoc, PartnerLogoInfoModel>('PartnerLogoInfo', partnerLogoInfoSchema);

export { PartnerLogoInfo };
