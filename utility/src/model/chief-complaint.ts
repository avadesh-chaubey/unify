import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface ChiefComplaintAttrs {
  id: string;
  chiefComplaint: string;
}

interface ChiefComplaintDoc extends mongoose.Document {
  chiefComplaint: string;
  version: number;
}


interface ChiefComplaintModel extends mongoose.Model<ChiefComplaintDoc> {
  build(attrs: ChiefComplaintAttrs): ChiefComplaintDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ChiefComplaintDoc | null>;
}

const chiefComplaintSchema = new mongoose.Schema(
  {
    chiefComplaint: {
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
chiefComplaintSchema.set('versionKey', 'version');
chiefComplaintSchema.plugin(updateIfCurrentPlugin);

chiefComplaintSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return ChiefComplaint.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
chiefComplaintSchema.static('build', (attrs: ChiefComplaintAttrs) => {
  return new ChiefComplaint({
    _id: attrs.id,
    chiefComplaint: attrs.chiefComplaint,
  });
});

const ChiefComplaint = mongoose.model<ChiefComplaintDoc, ChiefComplaintModel>('ChiefComplaint', chiefComplaintSchema);

export { ChiefComplaint };
