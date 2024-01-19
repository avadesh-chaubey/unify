import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface StateAttrs {
  id: string;
  stateId: string;
  stateName: string;
  countryId: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
}

interface StateDoc extends mongoose.Document {
  stateId: string;
  stateName: string;
  countryId: string;
  countryCode: string;
  countryName: string;
  stateCode: string;
  version: number;
}


interface StateModel extends mongoose.Model<StateDoc> {
  build(attrs: StateAttrs): StateDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<StateDoc | null>;
}

const stateSchema = new mongoose.Schema(
  {
    stateId: {
      type: String,
      required: true
    },
    stateName: {
      type: String,
      required: true,
    },
    countryId: {
      type: String,
      required: true
    },
    countryName: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    stateCode: {
      type: String,
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
stateSchema.set('versionKey', 'version');
stateSchema.plugin(updateIfCurrentPlugin);

stateSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return State.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
stateSchema.static('build', (attrs: StateAttrs) => {
  return new State({
    _id: attrs.id,
    stateId: attrs.stateId,
    stateName: attrs.stateName,
    countryId: attrs.countryId,
    countryName: attrs.countryName,
    countryCode: attrs.countryCode,
    stateCode: attrs.stateCode
  });
});

const State = mongoose.model<StateDoc, StateModel>('State', stateSchema);

export { State };
