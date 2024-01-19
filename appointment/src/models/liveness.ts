import mongoose from 'mongoose';

//1. Default Slice Duration  = 15 Min 

interface LivenessAttrs {
  id: string;
  currentSerialNumber: number;
  oldSerialNumber: number;
  pingCount: number;
}

interface LivenessDoc extends mongoose.Document {
  currentSerialNumber: number;
  oldSerialNumber: number;
  pingCount: number;
}

interface LivenessModel extends mongoose.Model<LivenessDoc> {
  build(attrs: LivenessAttrs): LivenessDoc;
  findByEvent(event: {
    id: string;
  }): Promise<LivenessDoc | null>;
}

const livenessSchema = new mongoose.Schema(
  {
    currentSerialNumber: {
      type: Number,
      required: true
    },
    oldSerialNumber: {
      type: Number,
      required: true
    },
    pingCount: {
      type: Number,
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

livenessSchema.static('findByEvent', (event: { id: string }) => {
  return Liveness.findOne({
    _id: event.id,
  });
});

livenessSchema.static('build', (attrs: LivenessAttrs) => {
  return new Liveness({
    _id: attrs.id,
    currentSerialNumber: attrs.currentSerialNumber,
    oldSerialNumber: attrs.oldSerialNumber,
    pingCount: attrs.pingCount,
  });
});

const Liveness = mongoose.model<LivenessDoc, LivenessModel>('Liveness', livenessSchema);

export { Liveness };
