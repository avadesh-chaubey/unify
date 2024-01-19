import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface SpecialityAttrs {
  id: string;
  specialityName: string;
  specialityDescription: string;
  organisationUID : string;
}

export interface SpecialityDoc extends mongoose.Document {
  specialityName: string;
  specialityDescription: string;
  organisationUID : string;
}

interface SpecialityModel extends mongoose.Model<SpecialityDoc> {
  build(attrs: SpecialityAttrs): SpecialityDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<SpecialityDoc | null>;
}

const specialitySchema = new mongoose.Schema({
    specialityName: {
      type: String,
      required: true
    },
    specialityDescription: {
      type: String,
      required: true
    },
	organisationUID: {
		type: String,
		required: false
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
specialitySchema.set('versionKey', 'version');
specialitySchema.plugin(updateIfCurrentPlugin);

specialitySchema.static('findByEvent', (event: { id: string, version: number }) => {
  return Speciality.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

specialitySchema.static('build', (attrs: SpecialityAttrs) => {
  return new Speciality({
    _id: attrs.id,
    specialityName: attrs.specialityName,
    specialityDescription: attrs.specialityDescription,
    organisationUID: attrs.organisationUID,
  });
});

const Speciality = mongoose.model<SpecialityDoc, SpecialityModel>('Speciality', specialitySchema);

export { Speciality };
