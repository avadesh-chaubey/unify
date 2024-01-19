import { ConsultationType, FollowupReminderType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface FollowupReminderAttrs {
  id: string;
  consultantName: string;
  consultationType: ConsultationType;
  followupReminderDate: string;
  parentPhoneNumber: string;
  customerName: string;
  followupReminderType: FollowupReminderType;
}

export interface FollowupReminderDoc extends mongoose.Document {
  consultantName: string;
  consultationType: ConsultationType;
  followupReminderDate: string;
  parentPhoneNumber: string;
  customerName: string;
  followupReminderType: FollowupReminderType;
  version: number;
}

interface FollowupReminderModel extends mongoose.Model<FollowupReminderDoc> {
  build(attrs: FollowupReminderAttrs): FollowupReminderDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<FollowupReminderDoc | null>;
}

const followupReminderSchema = new mongoose.Schema(
  {
    consultantName: {
      type: String,
      required: true
    },
    followupReminderDate: {
      type: String,
      required: true
    },
    consultationType: {
      type: ConsultationType,
      required: true
    },
    parentPhoneNumber: {
      type: String,
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    followupReminderType: {
      type: FollowupReminderType,
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
followupReminderSchema.set('versionKey', 'version');
followupReminderSchema.plugin(updateIfCurrentPlugin);

followupReminderSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return FollowupReminder.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

followupReminderSchema.static('build', (attrs: FollowupReminderAttrs) => {
  return new FollowupReminder({
    _id: attrs.id,
    consultantName: attrs.consultantName,
    consultationType: attrs.consultationType,
    followupReminderDate: attrs.followupReminderDate,
    parentPhoneNumber: attrs.parentPhoneNumber,
    customerName: attrs.customerName,
    followupReminderType: attrs.followupReminderType,
  });
});


const FollowupReminder = mongoose.model<FollowupReminderDoc, FollowupReminderModel>('FollowupReminder', followupReminderSchema);

export { FollowupReminder };
