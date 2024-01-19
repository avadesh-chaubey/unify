import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface CategoryAttrs {
  id: string;
  categoryName: string;
}

interface CategoryDoc extends mongoose.Document {
    categoryName: string;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
  build(attrs: CategoryAttrs): CategoryDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<CategoryDoc | null>;
}

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
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
categorySchema.set('versionKey', 'version');
categorySchema.plugin(updateIfCurrentPlugin);

categorySchema.static('findByEvent', (event: { id: string, version: number }) => {
  return Category.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

categorySchema.static('build', (attrs: CategoryAttrs) => {
  return new Category({
    _id: attrs.id,
    categoryName: attrs.categoryName
  });
});


const Category = mongoose.model<CategoryDoc, CategoryModel>('Category', categorySchema);
export { Category };
