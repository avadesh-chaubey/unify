import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { SlotAvailability } from '@unifycaredigital/aem';

//1. Default Slice Duration  = 15 Min 

interface AppointmentTimeTableAttrs {
  id: string;
  consultantId: string;
  partnerId: string;
  lastUpdatedBy: string;
  mondayAvailableSlotList: [SlotAvailability];
  tuesdayAvailableSlotList: [SlotAvailability];
  wednesdayAvailableSlotList: [SlotAvailability];
  thursdayAvailableSlotList: [SlotAvailability];
  fridayAvailableSlotList: [SlotAvailability];
  saturdayAvailableSlotList: [SlotAvailability];
  sundayAvailableSlotList: [SlotAvailability];
  sliceDurationInMin: number;
}

interface AppointmentTimeTableDoc extends mongoose.Document {
  consultantId: string;
  partnerId: string;
  lastUpdatedBy: string;
  mondayAvailableSlotList: [SlotAvailability];
  tuesdayAvailableSlotList: [SlotAvailability];
  wednesdayAvailableSlotList: [SlotAvailability];
  thursdayAvailableSlotList: [SlotAvailability];
  fridayAvailableSlotList: [SlotAvailability];
  saturdayAvailableSlotList: [SlotAvailability];
  sundayAvailableSlotList: [SlotAvailability];
  sliceDurationInMin: number;
  version: number;
}

interface AppointmentTimeTableModel extends mongoose.Model<AppointmentTimeTableDoc> {
  build(attrs: AppointmentTimeTableAttrs): AppointmentTimeTableDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<AppointmentTimeTableDoc | null>;
}

const appointmentTimeTableSchema = new mongoose.Schema(
  {
    consultantId: {
      type: String,
      required: true
    },
    partnerId: {
      type: String,
      required: true
    },
    lastUpdatedBy: {
      type: String,
      required: true
    },
    mondayAvailableSlotList: {
      type: [String],
      required: true
    },
    tuesdayAvailableSlotList: {
      type: [String],
      required: true
    },
    wednesdayAvailableSlotList: {
      type: [String],
      required: true
    },
    thursdayAvailableSlotList: {
      type: [String],
      required: true
    },
    fridayAvailableSlotList: {
      type: [String],
      required: true
    },
    saturdayAvailableSlotList: {
      type: [String],
      required: true
    },
    sundayAvailableSlotList: {
      type: [String],
      required: true
    },
    sliceDurationInMin: {
      type: Number,
      required: true
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
appointmentTimeTableSchema.set('versionKey', 'version');
appointmentTimeTableSchema.plugin(updateIfCurrentPlugin);

appointmentTimeTableSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return AppointmentTimeTable.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

appointmentTimeTableSchema.static('build', (attrs: AppointmentTimeTableAttrs) => {
  return new AppointmentTimeTable({
    _id: attrs.id,
    consultantId: attrs.consultantId,
    partnerId: attrs.partnerId,
    lastUpdatedBy: attrs.lastUpdatedBy,
    mondayAvailableSlotList: attrs.mondayAvailableSlotList,
    tuesdayAvailableSlotList: attrs.tuesdayAvailableSlotList,
    wednesdayAvailableSlotList: attrs.wednesdayAvailableSlotList,
    thursdayAvailableSlotList: attrs.thursdayAvailableSlotList,
    fridayAvailableSlotList: attrs.fridayAvailableSlotList,
    saturdayAvailableSlotList: attrs.saturdayAvailableSlotList,
    sundayAvailableSlotList: attrs.sundayAvailableSlotList,
    sliceDurationInMin: attrs.sliceDurationInMin,
  });
});


const AppointmentTimeTable = mongoose.model<AppointmentTimeTableDoc, AppointmentTimeTableModel>('AppointmentTimeTable', appointmentTimeTableSchema);

export { AppointmentTimeTable };
