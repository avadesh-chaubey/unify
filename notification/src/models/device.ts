import { DevicePushType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';

interface DeviceAttrs {
  id: string;
  uuid: string;
  token: string;
  voiptoken: string;
  deviceType: DevicePushType;
  topic: string;
}

export interface DeviceDoc extends mongoose.Document {
  uuid: string;
  token: string;
  voiptoken: string;
  deviceType: DevicePushType;
  topic: string;
}

interface DeviceModel extends mongoose.Model<DeviceDoc> {
  build(attrs: DeviceAttrs): DeviceDoc;
  findByEvent(event: {
    id: string;
  }): Promise<DeviceDoc | null>;
}

const deviceSchema = new mongoose.Schema(
  {
    deviceType: {
      type: DevicePushType,
      required: true
    },
    token: {
      type: String,
    },
    voiptoken: {
      type: String,
    },
    uuid: {
      type: String,
      required: true
    },
    topic: {
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

deviceSchema.static('findByEvent', (event: { id: string }) => {
  return Device.findOne({
    _id: event.id,
  });
});

deviceSchema.static('build', (attrs: DeviceAttrs) => {
  return new Device({
    _id: attrs.id,
    uuid: attrs.uuid,
    token: attrs.token,
    voiptoken: attrs.voiptoken,
    deviceType: attrs.deviceType,
    topic: attrs.topic,
  });
});

const Device = mongoose.model<DeviceDoc, DeviceModel>('Device', deviceSchema);

export { Device };
