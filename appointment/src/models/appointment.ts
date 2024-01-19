import { ConsultationType, AppointmentStatus, AppointmentPaymentStatus, OrderType, OrderStatus, UserType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface AppointmentTrack {
  stateUpdateTime: Date;
  state: string;
  appointmentDate: string;
  appointmentSlotId: string;
  appointmentRescheduleEnabled: boolean;
  updatedBy: UserType;
}

interface AppointmentAttrs {
  id: string;
  consultantId: string;
  customerId: string;
  creatorId: string;
  partnerId: string;
  parentId: string;
  createdBy: string;
  basePriceInINR: number;
  consultationType: ConsultationType;
  appointmentDate: string;
  appointmentSlotId: number;
  appointmentPaymentStatus: AppointmentPaymentStatus;
  expirationDate: Date;
  appointmentCreationTime: Date;
  appointmentTimeLine: [AppointmentTrack];
  assistantId: string;
  appointmentStatus: AppointmentStatus;
  assistantAppointmentDate: string;
  assistantAppointmentSlotId: string;
  assistantConsecutiveBookedSlots: number;
  assistantAppointmentTimeLine: [AppointmentTrack];
  appointmentRescheduleEnabled: boolean;
  assistantNotRequired: boolean;
  rescheduleSerialNumber: number;
  orderType: OrderType;
  orderStatus: OrderStatus;
  appointmentType: string;
}

interface AppointmentDoc extends mongoose.Document {
  consultantId: string;
  customerId: string;
  creatorId: string;
  partnerId: string;
  parentId: string;
  createdBy: string;
  basePriceInINR: number;
  consultationType: ConsultationType;
  appointmentDate: string;
  appointmentSlotId: number;
  appointmentPaymentStatus: AppointmentPaymentStatus;
  appointmentCreationTime: Date;
  expirationDate: Date;
  assistantId: string;
  appointmentStatus: AppointmentStatus;
  assistantAppointmentDate: string;
  assistantAppointmentSlotId: string;
  assistantConsecutiveBookedSlots: number;
  assistantAppointmentTimeLine: [AppointmentTrack];
  appointmentTimeLine: [AppointmentTrack];
  appointmentRescheduleEnabled: boolean;
  assistantNotRequired: boolean;
  rescheduleSerialNumber: number;
  orderType: OrderType;
  orderStatus: OrderStatus;
  arhOrderId: number;
  paymentMode: string;
  version: number;
  appointmentType: string;
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
    creatorId: {
      type: String,
      required: true
    },
    partnerId: {
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
    appointmentPaymentStatus: {
      type: AppointmentPaymentStatus,
      required: true
    },
    appointmentTimeLine: {
      type: [Object],
      required: false
    },
    assistantAppointmentTimeLine: {
      type: [Object],
      required: false
    },
    appointmentCreationTime: {
      type: Date,
      required: true
    },
    expirationDate: {
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
    assistantId: {
      type: String,
      required: false
    },
    appointmentStatus: {
      type: AppointmentStatus,
      required: false
    },
    assistantAppointmentSlotId: {
      type: String,
      required: false
    },
    assistantConsecutiveBookedSlots: {
      type: Number,
      required: false
    },
    assistantAppointmentDate: {
      type: String,
      required: false
    },
    appointmentRescheduleEnabled: {
      type: Boolean,
      required: false,
      default: false
    },
    orderType: {
      type: OrderType,
      required: false,
    },
    orderStatus: {
      type: OrderStatus,
      required: false,
    },
    rescheduleSerialNumber: {
      type: Number,
      required: false,
      default: 0
    },
    arhOrderId: {
      type: Number,
      required: false,
      default: 0
    },
    paymentMode: {
      type: String,
      required: false,
      default: 'Unknown'
    },
    assistantNotRequired: {
      type: Boolean,
      required: false,
      default: true
    },
	appointmentType: {
		type: String,
		required: false,
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
    appointmentPaymentStatus: attrs.appointmentPaymentStatus,
    assistantAppointmentTimeLine: attrs.assistantAppointmentTimeLine,
    appointmentCreationTime: attrs.appointmentCreationTime,
    expirationDate: attrs.expirationDate,
    appointmentTimeLine: attrs.appointmentTimeLine,
    createdBy: attrs.createdBy,
    creatorId: attrs.creatorId,
    basePriceInINR: attrs.basePriceInINR,
    assistantId: attrs.assistantId,
    appointmentStatus: attrs.appointmentStatus,
    assistantAppointmentDate: attrs.assistantAppointmentDate,
    assistantAppointmentSlotId: attrs.assistantAppointmentSlotId,
    assistantConsecutiveBookedSlots: attrs.assistantConsecutiveBookedSlots,
    appointmentRescheduleEnabled: attrs.appointmentRescheduleEnabled,
    assistantNotRequired: attrs.assistantNotRequired,
    orderType: attrs.orderType,
    orderStatus: attrs.orderStatus,
    rescheduleSerialNumber: attrs.rescheduleSerialNumber,
	appointmentType: attrs.appointmentType
  });
});


const Appointment = mongoose.model<AppointmentDoc, AppointmentModel>('Appointment', appointmentSchema);

export { Appointment };
