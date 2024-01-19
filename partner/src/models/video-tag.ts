import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface VideoTagAttrs {
  id: string;
  name: string;
  url: string;
  doctorIdList: [string],
  date: Date;
}

export interface VideoTagDoc extends mongoose.Document {
  name: string;
  doctorIdList: [string];
  url: string;
  date: Date;
  version: number;
}

interface VideoTagModel extends mongoose.Model<VideoTagDoc> {
  build(attrs: VideoTagAttrs): VideoTagDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<VideoTagDoc | null>;
}

const videoTagSchema = new mongoose.Schema(
  {
    name: {
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
videoTagSchema.set('versionKey', 'version');
videoTagSchema.plugin(updateIfCurrentPlugin);

videoTagSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return VideoTag.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

videoTagSchema.static('build', (attrs: VideoTagAttrs) => {
  return new VideoTag({
    _id: attrs.id,
    name: attrs.name,
    doctorIdList: attrs.doctorIdList,
    url: attrs.url,
    date: attrs.date
  });
});

const VideoTag = mongoose.model<VideoTagDoc, VideoTagModel>('VideoTag', videoTagSchema);

export { VideoTag };
