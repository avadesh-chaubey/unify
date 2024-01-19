import { ConsultationType, AppointmentStatus } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface AppointmentAttrs {
  id: string;
  consultantId: string;
  customerId: string;
  parentId: string;
  partnerId: string;
  basePriceInINR: number;
  consultationType: ConsultationType;
  appointmentDate: string;
  appointmentSlotId: number;
  appointmentStatus: AppointmentStatus;
  appointmentCreationTime: Date;
  parentPhoneNumber: string;
  customerName: string;
  assistantId: string;
  assistantName: string;
  consultantName: string;
}

export interface AppointmentDoc extends mongoose.Document {
  consultantId: string;
  customerId: string;
  parentId: string;
  partnerId: string;
  basePriceInINR: number;
  consultationType: ConsultationType;
  appointmentDate: string;
  appointmentSlotId: number;
  appointmentStatus: AppointmentStatus;
  appointmentCreationTime: Date;
  parentPhoneNumber: string;
  customerName: string;
  assistantId: string;
  assistantName: string;
  consultantName: string;
  version: number;
}

interface AppointmentModel extends mongoose.Model<AppointmentDoc> {
  build(attrs: AppointmentAttrs): AppointmentDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<AppointmentDoc | null>;
}

const appointmentSchema = new mongoose.Schema(
  {
    consultantId: {
      type: String,
      required: true
    },
    consultationType: {
      type: ConsultationType,
      required: true
    },
    customerId: {
      type: String,
      required: true
    },
    parentId: {
      type: String,
      required: true
    },
    partnerId: {
      type: String,
      required: true
    },
    appointmentSlotId: {
      type: Number,
      required: true
    },
    appointmentDate: {
      type: String,
      required: true
    },
    appointmentStatus: {
      type: AppointmentStatus,
      required: true
    },
    appointmentCreationTime: {
      type: Date,
      required: true
    },
    basePriceInINR: {
      type: Number,
      required: false,
      default: 0
    },
    customerName: {
      type: String,
      required: true
    },
    assistantId: {
      type: String,
      required: true
    },
    parentPhoneNumber: {
      type: String,
      default: ''
    },
    assistantName: {
      type: String,
      default: ''
    },
    consultantName: {
      type: String,
      default: ''
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
appointmentSchema.set('versionKey', 'version');
appointmentSchema.plugin(updateIfCurrentPlugin);

appointmentSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return Appointment.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

appointmentSchema.static('build', (attrs: AppointmentAttrs) => {
  return new Appointment({
    _id: attrs.id,
    consultantId: attrs.consultantId,
    consultationType: attrs.consultationType,
    customerId: attrs.customerId,
    partnerId: attrs.partnerId,
    parentId: attrs.parentId,
    appointmentSlotId: attrs.appointmentSlotId,
    appointmentDate: attrs.appointmentDate,
    appointmentStatus: attrs.appointmentStatus,
    appointmentCreationTime: attrs.appointmentCreationTime,
    basePriceInINR: attrs.basePriceInINR,
    customerName: attrs.customerName,
    assistantId: attrs.assistantId,
    parentPhoneNumber: attrs.parentPhoneNumber,
    assistantName: attrs.assistantName,
    consultantName: attrs.consultantName,
  });
});


const Appointment = mongoose.model<AppointmentDoc, AppointmentModel>('Appointment', appointmentSchema);

export { Appointment };
