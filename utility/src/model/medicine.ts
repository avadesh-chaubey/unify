import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface MedicineAttrs {
  id: string;
  medicineType: string;
  medicineName: string;
  packOf: string;
  MRP: number;
  gstInPercentage: number;
  hsnCode: string;
}

interface MedicineDoc extends mongoose.Document {
  medicineType: string;
  medicineName: string;
  packOf: string;
  MRP: number;
  gstInPercentage: number;
  hsnCode: string;
}


interface MedicineModel extends mongoose.Model<MedicineDoc> {
  build(attrs: MedicineAttrs): MedicineDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<MedicineDoc | null>;
}

const medicineSchema = new mongoose.Schema(
  {
    medicineType: {
      type: String,
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
    },
    packOf: {
      type: String,
      required: true,
    },
    MRP: {
      type: Number,
      required: true,
    },
    gstInPercentage: {
      type: Number,
      required: true,
    },
    hsnCode: {
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
medicineSchema.set('versionKey', 'version');
medicineSchema.plugin(updateIfCurrentPlugin);

medicineSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return Medicine.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
medicineSchema.static('build', (attrs: MedicineAttrs) => {
  return new Medicine({
    _id: attrs.id,
    medicineType: attrs.medicineType,
    medicineName: attrs.medicineName,
    packOf: attrs.packOf,
    MRP: attrs.MRP,
    gstInPercentage: attrs.gstInPercentage,
    hsnCode: attrs.hsnCode
  });
});

const Medicine = mongoose.model<MedicineDoc, MedicineModel>('Medicine', medicineSchema);

export { Medicine };
