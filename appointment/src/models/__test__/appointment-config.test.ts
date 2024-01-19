import { AppointmentConfig } from '../appointment-config';
import mongoose from 'mongoose';
import { SlotAvailability } from '@unifycaredigital/aem';

const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
const SLICE_DURATION_IN_MIN = 30;

const totalNumberOfSlots = (TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN);

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();

  let availableSlots: [SlotAvailability] = [SlotAvailability.Unavailable];

  for (let i = 1; i < totalNumberOfSlots; i++) {
    availableSlots!.push(SlotAvailability.Unavailable);
  }

  const appointmentConfig = AppointmentConfig.build({
    id,
    consultantId: new mongoose.Types.ObjectId().toHexString(),
    lastUpdatedBy: new mongoose.Types.ObjectId().toHexString(),
    appointmentDate: '2020-09-12',
    availableSlots: availableSlots!,
    sliceDurationInMin: SLICE_DURATION_IN_MIN,
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    basePriceInINR: 500,
    notPartOfTimeTable: false,
    isDoctorOnLeave: false,
    totalBookedSlots: 0,
    numberOfSlots: 0
  });


  // Save the profile to the database
  await appointmentConfig.save();

  // fetch the profile twice
  const firstInstance = await AppointmentConfig.findById(appointmentConfig.id);
  const secondInstance = await AppointmentConfig.findById(appointmentConfig.id);

  // make two separate changes to the profiles we fetched
  firstInstance!.set({ sliceDurationInMin: 30 });
  secondInstance!.set({ sliceDurationInMin: 15 });

  // save the first fetched profile
  await firstInstance!.save();

  // save the second fetched profile and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  let availableSlots: [SlotAvailability] = [SlotAvailability.Unavailable];

  for (let i = 1; i < totalNumberOfSlots; i++) {
    availableSlots!.push(SlotAvailability.Unavailable);
  }

  const appointmentConfig = AppointmentConfig.build({
    id,
    consultantId: new mongoose.Types.ObjectId().toHexString(),
    lastUpdatedBy: new mongoose.Types.ObjectId().toHexString(),
    appointmentDate: '2020-09-12',
    availableSlots: availableSlots!,
    sliceDurationInMin: SLICE_DURATION_IN_MIN,
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    basePriceInINR: 500,
    notPartOfTimeTable: false,
    isDoctorOnLeave: false,
    totalBookedSlots: 0,
    numberOfSlots: 0
  });
  await appointmentConfig.save();
  expect(appointmentConfig.version).toEqual(0);
  await appointmentConfig.save();
  expect(appointmentConfig.version).toEqual(1);
  await appointmentConfig.save();
  expect(appointmentConfig.version).toEqual(2);
});

it('find all Available Slots for perticular day', async () => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();
  let availableSlots: [SlotAvailability] = [SlotAvailability.Available];

  for (let i = 1; i < totalNumberOfSlots; i++) {
    availableSlots!.push(SlotAvailability.Available);
  }

  const appointmentConfig = AppointmentConfig.build({
    id,
    consultantId: new mongoose.Types.ObjectId().toHexString(),
    lastUpdatedBy: new mongoose.Types.ObjectId().toHexString(),
    appointmentDate: '2020-09-12',
    availableSlots: availableSlots!,
    sliceDurationInMin: SLICE_DURATION_IN_MIN,
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    basePriceInINR: 500,
    notPartOfTimeTable: false,
    isDoctorOnLeave: false,
    totalBookedSlots: 0,
    numberOfSlots: 0
  });

  // Save the profile to the database
  await appointmentConfig.save();

  const firstInstance = await AppointmentConfig.findById(appointmentConfig.id);

  let count = 0;

  for (let i = 0; i < (firstInstance!.availableSlots.length); i++) {
    if (firstInstance!.availableSlots[i] === SlotAvailability.Available) {
      count = count + 1;
    }
  }
  await firstInstance!.save();
  expect(count).toEqual(48);
});

