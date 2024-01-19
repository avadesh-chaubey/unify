import { PhysicianAssistantRoster, Roster } from '../physician-assistant-roster';
import mongoose from 'mongoose';
import { SlotAvailability } from '@unifycaredigital/aem';
const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
const SLICE_DURATION_IN_MIN = 15;

const totalNumberOfSlots = TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN;

it('implements optimistic concurrency control', async () => {
  // Create an instance of a profile
  const idA = new mongoose.Types.ObjectId().toHexString();
  const rosterA = {
    physicianAssistantId: idA,
    dateInYYYYMMDD: '2020-12-27',
    shiftFirstSlotId: 12,
    shiftLastSlotId: 80,
    numberOfAppointments: 0,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }
  const idB = new mongoose.Types.ObjectId().toHexString();
  const rosterB = {
    physicianAssistantId: idB,
    dateInYYYYMMDD: '2020-12-27',
    shiftFirstSlotId: 12,
    shiftLastSlotId: 80,
    numberOfAppointments: 2,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }
  const idC = new mongoose.Types.ObjectId().toHexString();
  const rosterC = {
    physicianAssistantId: idC,
    dateInYYYYMMDD: '2020-12-27',
    shiftFirstSlotId: 12,
    shiftLastSlotId: 80,
    numberOfAppointments: 1,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }
  const rosterD = {
    physicianAssistantId: idA,
    dateInYYYYMMDD: '2020-12-28',
    shiftFirstSlotId: 12,
    shiftLastSlotId: 80,
    numberOfAppointments: 2,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }
  const rosterE = {
    physicianAssistantId: idB,
    dateInYYYYMMDD: '2020-12-28',
    shiftFirstSlotId: 12,
    shiftLastSlotId: 80,
    numberOfAppointments: 1,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }
  const rosterF = {
    physicianAssistantId: idC,
    dateInYYYYMMDD: '2020-12-28',
    shiftFirstSlotId: 12,
    shiftLastSlotId: 80,
    numberOfAppointments: 1,
    onLeaveThisDay: false,
    weeklyDayOff: false,
    sliceDurationInMin: 15
  }

  const rosterList: Roster[][] = [[rosterA, rosterB, rosterC], [rosterD, rosterE, rosterF]]

  const physicianAssistantRoster = PhysicianAssistantRoster.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    availableAssistantList: rosterList
  });
  await physicianAssistantRoster.save();

  console.log(physicianAssistantRoster.availableAssistantList);

});