import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { DeviceDoc } from './device'
interface DeviceListAttrs {
  id: string;
  numberOfDevices: number;
  devices: DeviceDoc[];
}

export interface DeviceListDoc extends mongoose.Document {
  id: string;
  numberOfDevices: number;
  devices: DeviceDoc[];
  version: number;
}

interface DeviceListModel extends mongoose.Model<DeviceListDoc> {
  build(attrs: DeviceListAttrs): DeviceListDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<DeviceListDoc | null>;
}

const deviceListSchema = new mongoose.Schema(
  {
    devices: {
      type: [mongoose.Schema.Types.Mixed],
      ref: 'Device'
    },
    numberOfDevices: {
      type: Number,
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
deviceListSchema.set('versionKey', 'version');
deviceListSchema.plugin(updateIfCurrentPlugin);
// @ts-ignore - TODO
deviceListSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return DeviceList.findOne({
    _id: event.id,
  });
});
// @ts-ignore - TODO
deviceListSchema.static('build', (attrs: DeviceListAttrs) => {
  return new DeviceList({
    _id: attrs.id,
    devices: attrs.devices,
    numberOfDevices: attrs.numberOfDevices,
  });
});

const DeviceList = mongoose.model<DeviceListDoc, DeviceListModel>('DeviceList', deviceListSchema);

export { DeviceList };
