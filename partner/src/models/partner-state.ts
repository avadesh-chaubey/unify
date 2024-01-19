import mongoose from 'mongoose';
import { PartnerType, PartnerStates } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PartnerStateAttrs {
  id: string;
  superuserId: string;
  partnerId: string;
  partnerType: PartnerType;
  currentState: PartnerStates;
}

interface PartnerStateDoc extends mongoose.Document {
  superuserId: string;
  partnerId: string;
  partnerType: PartnerType;
  currentState: PartnerStates;
  version: number;
}


interface PartnerStateModel extends mongoose.Model<PartnerStateDoc> {
  build(attrs: PartnerStateAttrs): PartnerStateDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PartnerStateDoc | null>;
}

const partnerStateSchema = new mongoose.Schema(
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
    currentState: {
      type: PartnerStates,
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
partnerStateSchema.set('versionKey', 'version');
partnerStateSchema.plugin(updateIfCurrentPlugin);

partnerStateSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return PartnerState.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
partnerStateSchema.static('build', (attrs: PartnerStateAttrs) => {
  return new PartnerState({
    _id: attrs.id,
    superuserId: attrs.superuserId,
    partnerId: attrs.partnerId,
    partnerType: attrs.partnerType,
    currentState: attrs.currentState,
  });
});

const PartnerState = mongoose.model<PartnerStateDoc, PartnerStateModel>('PartnerState', partnerStateSchema);

export { PartnerState };
