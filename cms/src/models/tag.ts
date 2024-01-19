import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface TagAttrs {
  id: string;
  tagName: string;
}

interface TagDoc extends mongoose.Document {
    tagName: string;
}

interface TagModel extends mongoose.Model<TagDoc> {
  build(attrs: TagAttrs): TagDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TagDoc | null>;
}

const tagSchema = new mongoose.Schema(
  {
    tagName: {
      type: String,
      required: true
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
tagSchema.set('versionKey', 'version');
tagSchema.plugin(updateIfCurrentPlugin);

tagSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return Tag.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

tagSchema.static('build', (attrs: TagAttrs) => {
  return new Tag({
    _id: attrs.id,
    tagName: attrs.tagName
  });
});


const Tag = mongoose.model<TagDoc, TagModel>('Tag', tagSchema);
export { Tag };
