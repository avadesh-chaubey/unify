import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface MedicalConditionAttrs {
  id: string;
  medicalCondition: string;
}

interface MedicalConditionDoc extends mongoose.Document {
  medicalCondition: string;
  version: number;
}


interface MedicalConditionModel extends mongoose.Model<MedicalConditionDoc> {
  build(attrs: MedicalConditionAttrs): MedicalConditionDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<MedicalConditionDoc | null>;
}

const medicalConditionSchema = new mongoose.Schema(
  {
    medicalCondition: {
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
medicalConditionSchema.set('versionKey', 'version');
medicalConditionSchema.plugin(updateIfCurrentPlugin);

medicalConditionSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return MedicalCondition.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
medicalConditionSchema.static('build', (attrs: MedicalConditionAttrs) => {
  return new MedicalCondition({
    _id: attrs.id,
    medicalCondition: attrs.medicalCondition,
  });
});

const MedicalCondition = mongoose.model<MedicalConditionDoc, MedicalConditionModel>('MedicalCondition', medicalConditionSchema);

export { MedicalCondition };
