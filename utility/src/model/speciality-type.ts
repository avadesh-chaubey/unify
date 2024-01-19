import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface SpecialityTypeAttrs {
  id: string;
  specialityType: string;
}

interface SpecialityTypeDoc extends mongoose.Document {
  specialityType: string;
  version: number;
}


interface SpecialityTypeModel extends mongoose.Model<SpecialityTypeDoc> {
  build(attrs: SpecialityTypeAttrs): SpecialityTypeDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<SpecialityTypeDoc | null>;
}

const specialityTypeSchema = new mongoose.Schema(
  {
    specialityType: {
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
specialityTypeSchema.set('versionKey', 'version');
specialityTypeSchema.plugin(updateIfCurrentPlugin);

specialityTypeSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return SpecialityType.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
specialityTypeSchema.static('build', (attrs: SpecialityTypeAttrs) => {
  return new SpecialityType({
    _id: attrs.id,
    specialityType: attrs.specialityType,
  });
});

const SpecialityType = mongoose.model<SpecialityTypeDoc, SpecialityTypeModel>('SpecialityType', specialityTypeSchema);

export { SpecialityType };
