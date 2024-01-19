import { ConsultationType, AppointmentStatus, GenderType, AppointmentPaymentStatus, RelationshipType, OrderType, OrderStatus } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface AppointmentAttrs {
  id: string;
  consultantId: string;
  customerId: string;
  consultantName: string;
  consultantExperince: number;
  consultantProfileImageName: string;
  consultantDesignation: string;
  consultantQualification: string;
  creatorId: string;
  parentId: string;
  partnerId: string;
  createdBy: string;
  basePriceInINR: number;
  consultationType: ConsultationType;
  appointmentDate: string;
  appointmentSlotId: number;
  appointmentStatus: AppointmentStatus;
  appointmentCreationTime: Date;
  parentName: string;
  parentPhoneNumber: string;
  customerName: string;
  customerFirstName: string;
  customerLastName: string;
  customerGender: GenderType;
  customerDateOfBirth: string;
  customerProfileImageName: string;
  customerRelationship: RelationshipType;
  appointmentSummary: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  assistantId: string;
  assistantName: string;
  appointmentPaymentStatus: AppointmentPaymentStatus;
  assistantAppointmentDate: string;
  assistantAppointmentSlotId: string;
  assistantConsecutiveBookedSlots: number;
  appointmentRescheduleEnabled: boolean;
  arhOrderId: number;
  paymentMode: string;
  assistantNotRequired: boolean;
  assistantProfileImageName: string;
  agoraVideoCallStartUID: number;
  appointmentType: string
}

export interface AppointmentDoc extends mongoose.Document {
  consultantId: string;
  customerId: string;
  consultantName: string;
  consultantExperince: number;
  consultantProfileImageName: string;
  consultantDesignation: string;
  consultantQualification: [string];
  creatorId: string;
  parentId: string;
  partnerId: string;
  createdBy: string;
  basePriceInINR: number;
  consultationType: ConsultationType;
  appointmentDate: string;
  appointmentSlotId: number;
  appointmentStatus: AppointmentStatus;
  appointmentCreationTime: Date;
  parentName: string;
  parentPhoneNumber: string;
  customerName: string;
  customerFirstName: string;
  customerLastName: string;
  customerGender: GenderType;
  customerDateOfBirth: string;
  customerProfileImageName: string;
  customerRelationship: RelationshipType;
  appointmentSummary: string;
  orderType: OrderType;
  orderStatus: OrderStatus;
  assistantId: string;
  assistantName: string;
  appointmentPaymentStatus: AppointmentPaymentStatus;
  assistantAppointmentDate: string;
  assistantAppointmentSlotId: string;
  assistantConsecutiveBookedSlots: number;
  appointmentRescheduleEnabled: boolean;
  arhOrderId: number;
  paymentMode: string;
  assistantNotRequired: boolean;
  assistantProfileImageName: string;
  agoraVideoCallStartUID: number;
  appointmentType: string;
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
    paymentMode: {
      type: String,
      required: true
    },
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
    creatorId: {
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
    arhOrderId: {
      type: Number,
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
    createdBy: {
      type: String,
      required: true
    },
    basePriceInINR: {
      type: Number,
      required: false,
      default: 0
    },
    consultantName: {
      type: String,
      required: true
    },
    consultantExperince: {
      type: Number,
      required: true
    },
    consultantProfileImageName: {
      type: String,
      required: true
    },
    consultantDesignation: {
      type: String,
      required: true
    },
    consultantQualification: {
      type: String,
      required: true
    },
    customerFirstName: {
      type: String,
      required: true
    },
    customerLastName: {
      type: String,
      required: false,
      default: ""
    },
    customerName: {
      type: String,
      required: true
    },
    customerDateOfBirth: {
      type: String,
      required: true
    },
    customerProfileImageName: {
      type: String,
      required: true
    },
    customerGender: {
      type: GenderType,
      required: true
    },
    customerRelationship: {
      type: RelationshipType,
      required: true
    },
    appointmentSummary: {
      type: String,
    },
    orderType: {
      type: OrderType
    },
    orderStatus: {
      type: OrderStatus
    },
    assistantId: {
      type: String,
      required: true
    },
    appointmentPaymentStatus: {
      type: AppointmentPaymentStatus,
      required: true
    },
    assistantAppointmentDate: {
      type: String,
      required: true
    },
    assistantAppointmentSlotId: {
      type: String,
      required: true
    },
    parentName: {
      type: String,
      default: ''
    },
    parentPhoneNumber: {
      type: String,
      default: ''
    },
    assistantName: {
      type: String,
      default: ''
    },
    assistantConsecutiveBookedSlots: {
      type: Number,
      required: true
    },
    appointmentRescheduleEnabled: {
      type: Boolean,
      required: true
    },
    assistantNotRequired: {
      type: Boolean,
      required: true
    },
    assistantProfileImageName: {
      type: String,
      default: ''
    },
    agoraVideoCallStartUID: {
      type: Number,
      default: 0
    },
	appointmentType: {
		type: String,
		required : true
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
    createdBy: attrs.createdBy,
    creatorId: attrs.creatorId,
    basePriceInINR: attrs.basePriceInINR,
    consultantName: attrs.consultantName,
    consultantExperince: attrs.consultantExperince,
    consultantProfileImageName: attrs.consultantProfileImageName,
    consultantDesignation: attrs.consultantDesignation,
    consultantQualification: attrs.consultantQualification,
    customerName: attrs.customerName,
    customerFirstName: attrs.customerFirstName,
    customerLastName: attrs.customerLastName,
    customerGender: attrs.customerGender,
    customerDateOfBirth: attrs.customerDateOfBirth,
    customerProfileImageName: attrs.customerProfileImageName,
    customerRelationship: attrs.customerRelationship,
    appointmentSummary: attrs.appointmentSummary,
    orderType: attrs.orderType,
    orderStatus: attrs.orderStatus,
    assistantId: attrs.assistantId,
    appointmentPaymentStatus: attrs.appointmentPaymentStatus,
    assistantAppointmentDate: attrs.assistantAppointmentDate,
    assistantAppointmentSlotId: attrs.assistantAppointmentSlotId,
    assistantConsecutiveBookedSlots: attrs.assistantConsecutiveBookedSlots,
    appointmentRescheduleEnabled: attrs.appointmentRescheduleEnabled,
    arhOrderId: attrs.arhOrderId,
    paymentMode: attrs.paymentMode,
    parentName: attrs.parentName,
    parentPhoneNumber: attrs.parentPhoneNumber,
    assistantNotRequired: attrs.assistantNotRequired,
    assistantName: attrs.assistantName,
    assistantProfileImageName: attrs.assistantProfileImageName,
    agoraVideoCallStartUID: attrs.agoraVideoCallStartUID,
	appointmentType: attrs.appointmentType
  });
});


const Appointment = mongoose.model<AppointmentDoc, AppointmentModel>('Appointment', appointmentSchema);

export { Appointment };
