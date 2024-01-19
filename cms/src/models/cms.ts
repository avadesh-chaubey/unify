import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CmsAttrs {
  id: string;
  blogId: string;
  title: string;
  metaKeywords: [string];
  metaDescription: string;
  seoUrl: string;
  titleImageUrl: string;
  content: string;
  categories: [string];
  tags: [string];
  authorName: string;
  publishedDate: string;
  isPublished: boolean;
  blogPublishedDate: string;
  blogPublishedTime: string;
  buttonCaption: string;
  sorting: number;
  publishOnHomePage: boolean;
  action: boolean;
}

interface CmsDoc extends mongoose.Document {
  blogId: string;
  title: string;
  metaKeywords: [string];
  metaDescription: string;
  seoUrl: string;
  titleImageUrl: string;
  content: string;
  categories: [string];
  tags: [string];
  authorName: string;
  publishedDate: string;
  isPublished: boolean;
  blogPublishedDate: string;
  blogPublishedTime: string;
  buttonCaption: string;
  sorting: number;
  publishOnHomePage: boolean;
  action: boolean;
}

interface CmsModel extends mongoose.Model<CmsDoc> {
  build(attrs: CmsAttrs): CmsDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<CmsDoc | null>;
}

const cmsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    blogId: {
      type: String,
      required: true
    },
    metaKeywords: {
      type: [String],
      required: false,
      default: ""
    },
    metaDescription: {
      type: String,
      required: true
    },
    seoUrl: {
      type: String,
      required: true
    },
    titleImageUrl: {
      type: String,
      required: false,
      default: ""
    },
    content: {
      type: String,
      required: true
    },
    categories: {
      type: [String],
      required: true
    },
    tags: {
      type: [String],
      required: true
    },
    authorName: {
      type: String,
      required: true
    },
    publishedDate: {
      type: String,
      required: false,
      default: ""
    },
    isPublished: {
      type: Boolean,
      required: true
    },
    blogPublishedDate: {
      type: String,
      required: false,
      default: ""
    },
    blogPublishedTime: {
      type: String,
      required: false,
      default: ""
    },
    buttonCaption: {
      type: String,
      required: false,
    },
    sorting: {
      type: Number,
      required: false,
    },
    publishOnHomePage: {
      type: Boolean,
      required: false,
    },
    action: {
      type: Boolean,
      required: false,
      default: false
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
cmsSchema.set('versionKey', 'version');
cmsSchema.plugin(updateIfCurrentPlugin);

cmsSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return Cms.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

cmsSchema.static('build', (attrs: CmsAttrs) => {
  return new Cms({
    _id: attrs.id,
    blogId: attrs.blogId,
    title: attrs.title,
    metaKeywords: attrs.metaKeywords,
    metaDescription: attrs.metaDescription,
    seoUrl: attrs.seoUrl,
    titleImageUrl: attrs.titleImageUrl,
    content: attrs.content,
    categories: attrs.categories,
    tags: attrs.tags,
    authorName: attrs.authorName,
    publishedDate: attrs.publishedDate,
    isPublished: attrs.isPublished,
    blogPublishedDate: attrs.blogPublishedDate,
    blogPublishedTime: attrs.blogPublishedTime,
    buttonCaption: attrs.buttonCaption,
    sorting: attrs.sorting,
    publishOnHomePage: attrs.publishOnHomePage,
    action: attrs.action
  });
});


const Cms = mongoose.model<CmsDoc, CmsModel>('Cms', cmsSchema);
export { Cms };