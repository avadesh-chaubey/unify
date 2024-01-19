import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface CountryAttrs {
  id: string;
  countryId: string;
  countryName: string;
  iso2: string;
  iso3: string;
  phoneCode: string;
}

interface CountryDoc extends mongoose.Document {
  countryId: string;
  countryName: string;
  iso2: string;
  iso3: string;
  phoneCode: string;
  version: number;
}


interface CountryModel extends mongoose.Model<CountryDoc> {
  build(attrs: CountryAttrs): CountryDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<CountryDoc | null>;
}

const countrySchema = new mongoose.Schema(
  {
    countryId: {
      type: String,
      required: true
    },
    countryName: {
      type: String,
      required: true,
    },
    iso2: {
      type: String,
    },
    iso3: {
      type: String,
    },
    phoneCodeName: {
      type: String,
    },
    stateCode: {
      type: String,
    },
    countryCode: {
      type: String,
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
countrySchema.set('versionKey', 'version');
countrySchema.plugin(updateIfCurrentPlugin);

countrySchema.static('findByEvent', (event: { id: string, version: number }) => {
  return Country.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
countrySchema.static('build', (attrs: CountryAttrs) => {
  return new Country({
    _id: attrs.id,
    countryId: attrs.countryId,
    countryName: attrs.countryName,
    iso2: attrs.iso2,
    iso3: attrs.iso3,
    phoneCode: attrs.phoneCode
  });
});

const Country = mongoose.model<CountryDoc, CountryModel>('Country', countrySchema);

export { Country };
