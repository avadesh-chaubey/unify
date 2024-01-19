import { UserType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

// interface CallDetails {
//   callStartTime: Date;
//   callEndTime: Date;
//   durationInMin: number;
//   startedById: string;
//   endById: string;
//   startedByName: string;
//   endByName: string;
//   startedByType: UserType;
//   endByType: UserType;
//   isCallInProgress: boolean;
//   token: string;
//   tokenStartTime: Date;
//   tokenExpiryTime: Date;
// }

interface CallDetails {
  callStartTime: Date;
  callEndTime: Date;
  durationInMin: number;
  isCallInProgress: boolean;
  startById: string;
  endById: string;
}

interface VideoCallAttrs {
  id: string;
  callDetails: [CallDetails];
}

interface VideoCallDoc extends mongoose.Document {
  callDetails: [CallDetails];
}

interface VideoCallModel extends mongoose.Model<VideoCallDoc> {
  build(attrs: VideoCallAttrs): VideoCallDoc;
  findByEvent(event: {
    id: string;
  }): Promise<VideoCallDoc | null>;
}

const videoCallSchema = new mongoose.Schema(
  {
    callDetails: {
      type: Object,
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

videoCallSchema.static('findByEvent', (event: { id: string }) => {
  return VideoCall.findOne({
    _id: event.id,
  });
});

videoCallSchema.static('build', (attrs: VideoCallAttrs) => {
  return new VideoCall({
    _id: attrs.id,
    callDetails: attrs.callDetails,
  });
});


const VideoCall = mongoose.model<VideoCallDoc, VideoCallModel>('VideoCall', videoCallSchema);

export { VideoCall };
