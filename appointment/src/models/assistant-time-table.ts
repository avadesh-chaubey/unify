import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { SlotAvailability } from '@unifycaredigital/aem';

export interface AssistantAvailability {
  shiftFirstSlotId: number;
  shiftLastSlotId: number;
  weeklyDayOff: boolean;
}

interface AssistantTimeTableAttrs {
  id: string;
  assistantId: string;
  partnerId: string;
  mondayAvailability: AssistantAvailability;
  tuesdayAvailability: AssistantAvailability;
  wednesdayAvailability: AssistantAvailability;
  thursdayAvailability: AssistantAvailability;
  fridayAvailability: AssistantAvailability;
  saturdayAvailability: AssistantAvailability;
  sundayAvailability: AssistantAvailability;
}

interface AssistantTimeTableDoc extends mongoose.Document {
  assistantId: string;
  partnerId: string;
  mondayAvailability: AssistantAvailability;
  tuesdayAvailability: AssistantAvailability;
  wednesdayAvailability: AssistantAvailability;
  thursdayAvailability: AssistantAvailability;
  fridayAvailability: AssistantAvailability;
  saturdayAvailability: AssistantAvailability;
  sundayAvailability: AssistantAvailability;
  version: number;
}

interface AssistantTimeTableModel extends mongoose.Model<AssistantTimeTableDoc> {
  build(attrs: AssistantTimeTableAttrs): AssistantTimeTableDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<AssistantTimeTableDoc | null>;
}

const assistantTimeTableSchema = new mongoose.Schema(
  {
    assistantId: {
      type: String,
      required: true
    },
    partnerId: {
      type: String,
      required: true
    },
    mondayAvailability: {
      type: Object,
      required: true
    },
    tuesdayAvailability: {
      type: Object,
      required: true
    },
    wednesdayAvailability: {
      type: Object,
      required: true
    },
    thursdayAvailability: {
      type: Object,
      required: true
    },
    fridayAvailability: {
      type: Object,
      required: true
    },
    saturdayAvailability: {
      type: Object,
      required: true
    },
    sundayAvailability: {
      type: Object,
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
assistantTimeTableSchema.set('versionKey', 'version');
assistantTimeTableSchema.plugin(updateIfCurrentPlugin);

assistantTimeTableSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return AssistantTimeTable.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});

assistantTimeTableSchema.static('build', (attrs: AssistantTimeTableAttrs) => {
  return new AssistantTimeTable({
    _id: attrs.id,
    assistantId: attrs.assistantId,
    partnerId: attrs.partnerId,
    mondayAvailability: attrs.mondayAvailability,
    tuesdayAvailability: attrs.tuesdayAvailability,
    wednesdayAvailability: attrs.wednesdayAvailability,
    thursdayAvailability: attrs.thursdayAvailability,
    fridayAvailability: attrs.fridayAvailability,
    saturdayAvailability: attrs.saturdayAvailability,
    sundayAvailability: attrs.sundayAvailability,
  });
});

const AssistantTimeTable = mongoose.model<AssistantTimeTableDoc, AssistantTimeTableModel>('AssistantTimeTable', assistantTimeTableSchema);

export { AssistantTimeTable };
