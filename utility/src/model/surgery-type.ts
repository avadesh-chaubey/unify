import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface SurgeryTypeAttrs {
  id: string;
  surgeryType: string;
}

interface SurgeryTypeDoc extends mongoose.Document {
    surgeryType: string;
    version: number;
}


interface SurgeryTypeModel extends mongoose.Model<SurgeryTypeDoc> {
  build(attrs: SurgeryTypeAttrs): SurgeryTypeDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<SurgeryTypeAttrs | null>;
}

const surgeryTypeSchema = new mongoose.Schema(
  {
    surgeryType: {
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
surgeryTypeSchema.set('versionKey', 'version');
surgeryTypeSchema.plugin(updateIfCurrentPlugin);

surgeryTypeSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return SurgeryType.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
surgeryTypeSchema.static('build', (attrs: SurgeryTypeAttrs) => {
  return new SurgeryType({
    _id: attrs.id,
    surgeryType: attrs.surgeryType,
  });
});

const SurgeryType = mongoose.model<SurgeryTypeDoc, SurgeryTypeModel>('SurgeryType', surgeryTypeSchema);

export { SurgeryType };
