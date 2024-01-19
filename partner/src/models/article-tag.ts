import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ArticleTagAttrs {
  id: string;
  desription: string;
  date: Date;
  url: string;
  doctorIdList: [string]
}

export interface ArticleTagDoc extends mongoose.Document {
  description: string;
  doctorIdList: [string];
  url: string;
  date: Date;
  version: number;
}

interface ArticleTagModel extends mongoose.Model<ArticleTagDoc> {
  build(attrs: ArticleTagAttrs): ArticleTagDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ArticleTagDoc | null>;
}

const articleTagSchema = new mongoose.Schema(
  {
    description: {
      type: String
    },
    doctorIdList: {
      type: [String]
    },
    url: {
      type: String
    },
    date: {
      type: Date
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
articleTagSchema.set('versionKey', 'version');
articleTagSchema.plugin(updateIfCurrentPlugin);

articleTagSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return ArticleTag.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

articleTagSchema.static('build', (attrs: ArticleTagAttrs) => {
  return new ArticleTag({
    _id: attrs.id,
    doctorIdList: attrs.doctorIdList,
    description: attrs.desription,
    url: attrs.url,
    date: attrs.date
  });
});

const ArticleTag = mongoose.model<ArticleTagDoc, ArticleTagModel>('ArticleTag', articleTagSchema);

export { ArticleTag };
