import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface LanguageAttrs {
  id: string;
  name: string;
  shortName: string;
}

interface LanguageDoc extends mongoose.Document {
  name: string;
  shortName: string;
  version: number;
}


interface LanguageModel extends mongoose.Model<LanguageDoc> {
  build(attrs: LanguageAttrs): LanguageDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<LanguageDoc | null>;
}

const languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortName: {
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
languageSchema.set('versionKey', 'version');
languageSchema.plugin(updateIfCurrentPlugin);

languageSchema.static('findByEvent',(event: { id: string, version: number }) => {
  return Language.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
languageSchema.static('build',(attrs: LanguageAttrs) => {
  return new Language({
    _id: attrs.id,
    name: attrs.name,
    shortName: attrs.shortName
  });
});

const Language = mongoose.model<LanguageDoc, LanguageModel>('Language', languageSchema);

export { Language };
