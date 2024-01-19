import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
const SLICE_DURATION_IN_MIN = 15;

const totalNumberOfSlots = (TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN); //96

// Slot 1 - 00:01 - 00:15 AM   Slot Number = 0
// Slot 96 - 11:45 - 00:00 PM  Slot Number = 95
// 8:45 - 9:00 AM is slot number 34   (8X4 = 32 + 3 = 35 = 34 {As Slot number starts from 0})
// First Active Slot 8:01 AM Slot Number : 32   //inclusive
// Last Active Slot 9:46 PM Slot Number : 87    
// Total Active Slots = 87 - 32 + 1= 56 //Hopping you already understood the logic 

export interface Roster {
  physicianAssistantId: string;
  dateInYYYYMMDD: string;
  shiftFirstSlotId: number;
  shiftLastSlotId: number;
  numberOfAppointments: number;
  onLeaveThisDay: boolean;
  weeklyDayOff: boolean;
  sliceDurationInMin: number;
}

interface PhysicianAssistantRosterAttrs {
  id: string;
  availableAssistantList: Roster[][];
}

interface PhysicianAssistantRosterDoc extends mongoose.Document {
  availableAssistantList: Roster[][];
}

interface PhysicianAssistantRosterModel extends mongoose.Model<PhysicianAssistantRosterDoc> {
  build(attrs: PhysicianAssistantRosterAttrs): PhysicianAssistantRosterDoc;
  findByEvent(event: {
    id: string;
  }): Promise<PhysicianAssistantRosterDoc | null>;
}

const physicianAssistantRosterSchema = new mongoose.Schema(
  {
    availableAssistantList: {
      type: [[Object], [Object]],
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
// physicianAssistantRosterSchema.set('versionKey', 'version');
// physicianAssistantRosterSchema.plugin(updateIfCurrentPlugin);

physicianAssistantRosterSchema.static('findByEvent', (event: { id: string}) => {
  return PhysicianAssistantRoster.findOne({
    _id: event.id
  });
});
physicianAssistantRosterSchema.static('build', (attrs: PhysicianAssistantRosterAttrs) => {
  return new PhysicianAssistantRoster({
    _id: attrs.id,
    availableAssistantList: attrs.availableAssistantList,
  });
});

const PhysicianAssistantRoster = mongoose.model<PhysicianAssistantRosterDoc, PhysicianAssistantRosterModel>('PhysicianAssistantRoster', physicianAssistantRosterSchema);

export { PhysicianAssistantRoster };
