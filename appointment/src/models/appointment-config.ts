import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { SlotAvailability } from '@unifycaredigital/aem';

//1. Default Slice Duration  = 15 Min 

interface AppointmentConfigAttrs {
  id: string;
  consultantId: string;
  partnerId: string;
  basePriceInINR: number;
  lastUpdatedBy: string;
  appointmentDate: string;
  availableSlots: [SlotAvailability];
  sliceDurationInMin: number;
  notPartOfTimeTable: boolean;
  isDoctorOnLeave: boolean;
  totalBookedSlots: number;
  numberOfSlots: number;
}

interface AppointmentConfigDoc extends mongoose.Document {
  consultantId: string;
  partnerId: string;
  lastUpdatedBy: string;
  basePriceInINR: number;
  appointmentDate: string;
  availableSlots: [SlotAvailability];
  sliceDurationInMin: number;
  notPartOfTimeTable: boolean;
  isDoctorOnLeave: boolean;
  totalBookedSlots: number;
  numberOfSlots: number;
  version: number;
}

interface AppointmentConfigModel extends mongoose.Model<AppointmentConfigDoc> {
  build(attrs: AppointmentConfigAttrs): AppointmentConfigDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<AppointmentConfigDoc | null>;
}

const appointmentConfigSchema = new mongoose.Schema(
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
    appointmentDate: {
      type: String,
      required: true
    },
    availableSlots: {
      type: [String],
      required: true
    },
    sliceDurationInMin: {
      type: Number,
      required: true
    },
    basePriceInINR: {
      type: Number,
      required: false,
      default: 0
    },
    notPartOfTimeTable: {
      type: Boolean,
      required: true,
      default: false
    },
    isDoctorOnLeave: {
      type: Boolean,
      required: true,
      default: false
    },
    totalBookedSlots: {
      type: Number,
      required: false,
      default: 0
    },
    numberOfSlots: {
      type: Number,
      required: false,
      default: 0
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
appointmentConfigSchema.set('versionKey', 'version');
appointmentConfigSchema.plugin(updateIfCurrentPlugin);

appointmentConfigSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return AppointmentConfig.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

appointmentConfigSchema.static('build', (attrs: AppointmentConfigAttrs) => {
  return new AppointmentConfig({
    _id: attrs.id,
    consultantId: attrs.consultantId,
    partnerId: attrs.partnerId,
    lastUpdatedBy: attrs.lastUpdatedBy,
    basePriceInINR: attrs.basePriceInINR,
    appointmentDate: attrs.appointmentDate,
    availableSlots: attrs.availableSlots,
    sliceDurationInMin: attrs.sliceDurationInMin,
    notPartOfTimeTable: attrs.notPartOfTimeTable,
    isDoctorOnLeave: attrs.isDoctorOnLeave,
    totalBookedSlots: attrs.totalBookedSlots,
    numberOfSlots: attrs.numberOfSlots
  });
});

const AppointmentConfig = mongoose.model<AppointmentConfigDoc, AppointmentConfigModel>('AppointmentConfig', appointmentConfigSchema);

export { AppointmentConfig };
