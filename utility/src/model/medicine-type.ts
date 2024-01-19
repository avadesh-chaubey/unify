import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface MedicineTypeAttrs {
  id: string;
  medicineType: string;
}

interface MedicineTypeDoc extends mongoose.Document {
  medicineType: string;
  version: number;
}


interface MedicineTypeModel extends mongoose.Model<MedicineTypeDoc> {
  build(attrs: MedicineTypeAttrs): MedicineTypeDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<MedicineTypeDoc | null>;
}

const medicineTypeSchema = new mongoose.Schema(
  {
    medicineType: {
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
medicineTypeSchema.set('versionKey', 'version');
medicineTypeSchema.plugin(updateIfCurrentPlugin);

medicineTypeSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return MedicineType.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
medicineTypeSchema.static('build', (attrs: MedicineTypeAttrs) => {
  return new MedicineType({
    _id: attrs.id,
    medicineType: attrs.medicineType,
  });
});

const MedicineType = mongoose.model<MedicineTypeDoc, MedicineTypeModel>('MedicineType', medicineTypeSchema);

export { MedicineType };
