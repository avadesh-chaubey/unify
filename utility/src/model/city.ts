import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface CityAttrs {
  id: string;
  cityId: string;
  cityName: string;
  stateId: string;
  stateCode: string;
  stateName: string;
  countryId: string;
  countryCode: string;
  countryName: string;

}

interface CityDoc extends mongoose.Document {
  cityId: string;
  cityName: string;
  stateId: string;
  stateCode: string;
  stateName: string;
  countryId: string;
  countryCode: string;
  countryName: string;
  version: number;
}


interface CityModel extends mongoose.Model<CityDoc> {
  build(attrs: CityAttrs): CityDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<CityDoc | null>;
}

const citySchema = new mongoose.Schema(
  {
    cityId: {
      type: String,
      required: true
    },
    cityName: {
      type: String,
      required: true,
    },
    stateId: {
      type: String,
      required: true,
    },
    stateCode: {
      type: String,
    },
    stateName: {
      type: String,
      required: true,
    },
    countryId: {
      type: String,
      required: true
    },
    countryCode: {
      type: String,
      required: true
    },
    countryName: {
      type: String,
      required: true
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
citySchema.set('versionKey', 'version');
citySchema.plugin(updateIfCurrentPlugin);

citySchema.static('findByEvent', (event: { id: string, version: number }) => {
  return City.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
citySchema.static('build', (attrs: CityAttrs) => {
  return new City({
    _id: attrs.id,
    cityId: attrs.cityId,
    cityName: attrs.cityName,
    stateId: attrs.stateId,
    stateCode: attrs.stateCode,
    stateName: attrs.stateName,
    countryId: attrs.countryId,
    countryCode: attrs.countryCode,
    countryName: attrs.countryName


  });
});

const City = mongoose.model<CityDoc, CityModel>('City', citySchema);

export { City };
