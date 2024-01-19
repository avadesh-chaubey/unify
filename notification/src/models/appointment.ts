import { ConsultationType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface AppointmentAttrs {
  id: string;
  consultantId: string;
  customerId: string;
  parentId: string;
  appointmentDate: string;
  appointmentSlotId: number;
  consultationType: ConsultationType;
  assistantId: string;
  consultantName: string;
  assistantName: string;
  parentName: string;
  patientAgoraUid: string;
  doctorAgoraUid: string;
  assistantAgoraId: string;
  parentEmailId: string;
  consultantEmailId: string;
  assistantEmailId: string;
}

interface AppointmentDoc extends mongoose.Document {
  consultantId: string;
  customerId: string;
  parentId: string;
  appointmentDate: string;
  appointmentSlotId: number;
  consultationType: ConsultationType;
  assistantId: string;
  consultantName: string;
  assistantName: string;
  parentName: string;
  patientAgoraUid: string;
  doctorAgoraUid: string;
  assistantAgoraId: string;
  parentEmailId: string;
  consultantEmailId: string;
  assistantEmailId: string;
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
    customerId: {
      type: String,
      required: true
    },
    parentId: {
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
    consultationType: {
      type: ConsultationType,
      required: true
    },
    assistantId: {
      type: String,
      required: true
    },
    consultantName: {
      type: String,
      required: false,
      default: ''
    },
    assistantName: {
      type: String,
      required: false,
      default: ''
    },
    parentName: {
      type: String,
      required: false,
      default: ''
    },
    patientAgoraUid: {
      type: String,
      required: false,
      default: 'NA'
    },
    doctorAgoraUid: {
      type: String,
      required: false,
      default: 'NA'
    },
    assistantAgoraId: {
      type: String,
      required: false,
      default: 'NA'
    },
    parentEmailId: {
      type: String,
      required: false,
      default: 'NA'
    },
    consultantEmailId: {
      type: String,
      required: false,
      default: 'NA'
    },
    assistantEmailId: {
      type: String,
      required: false,
      default: 'NA'
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
    customerId: attrs.customerId,
    parentId: attrs.parentId,
    appointmentSlotId: attrs.appointmentSlotId,
    appointmentDate: attrs.appointmentDate,
    consultationType: attrs.consultationType,
    assistantId: attrs.assistantId,
    consultantName: attrs.consultantName,
    assistantName: attrs.assistantName,
    parentName: attrs.parentName,
    patientAgoraUid: attrs.patientAgoraUid,
    doctorAgoraUid: attrs.doctorAgoraUid,
    assistantAgoraId: attrs.assistantAgoraId,
    parentEmailId: attrs.parentEmailId,
    consultantEmailId: attrs.consultantEmailId,
    assistantEmailId: attrs.assistantEmailId
  });
});


const Appointment = mongoose.model<AppointmentDoc, AppointmentModel>('Appointment', appointmentSchema);

export { Appointment };
