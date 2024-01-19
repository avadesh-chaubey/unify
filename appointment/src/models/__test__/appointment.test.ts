import { Appointment } from '../appointment';
import mongoose from 'mongoose';
import { ConsultationType, AppointmentStatus, AppointmentPaymentStatus, OrderType, OrderStatus, UserType } from '@unifycaredigital/aem';
const TOTAL_NUMBER_OF_MIN_IN_A_DAY = 1440;
const SLICE_DURATION_IN_MIN = 30;

const totalNumberOfSlots = TOTAL_NUMBER_OF_MIN_IN_A_DAY / SLICE_DURATION_IN_MIN;

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();

  const appointmentTrack = {
    stateUpdateTime: new Date(),
    state: AppointmentPaymentStatus.Blocked,
    appointmentDate: 'appointmentDate',
    appointmentSlotId: '15',
    appointmentRescheduleEnabled: false,
    updatedBy: UserType.System,
  }

  const assistantAppointmentTrack = {
    stateUpdateTime: new Date(),
    state: AppointmentStatus.CaseHistoryPending,
    appointmentDate: 'appointmentDate',
    appointmentSlotId: '15',
    appointmentRescheduleEnabled: false,
    updatedBy: UserType.System,
  }

  const appointmentConfig = Appointment.build({
    id,
    consultantId: 'string',
    customerId: 'string',
    creatorId: 'string',
    appointmentSlotId: 3,
    parentId: id,
    createdBy: 'UserType.CustomerSupport',
    consultationType: ConsultationType.Diabetologist,
    appointmentDate: 'string',
    appointmentPaymentStatus: AppointmentPaymentStatus.Blocked,
    appointmentCreationTime: new Date(),
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    appointmentTimeLine: [appointmentTrack],
    assistantAppointmentTimeLine: [assistantAppointmentTrack],
    expirationDate: new Date(),
    basePriceInINR: 500,
    assistantId: 'string',
    appointmentStatus: AppointmentStatus.CaseHistoryPending,
    assistantAppointmentDate: 'string',
    assistantAppointmentSlotId: '15',
    assistantConsecutiveBookedSlots: 1,
    appointmentRescheduleEnabled: false,
    orderType: OrderType.PaidAppointment,
    orderStatus: OrderStatus.Created,
    rescheduleSerialNumber: 0,
    assistantNotRequired: false
  });

  // Save the profile to the database
  await appointmentConfig.save();

  // fetch the profile twice
  const firstInstance = await Appointment.findById(appointmentConfig.id);
  const secondInstance = await Appointment.findById(appointmentConfig.id);

  // make two separate changes to the profiles we fetched
  firstInstance!.set({ appointmentSlotId: '30' });
  secondInstance!.set({ appointmentSlotId: '15' });

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

  const appointmentTrack = {
    stateUpdateTime: new Date(),
    state: AppointmentPaymentStatus.Blocked,
    appointmentDate: 'appointmentDate',
    appointmentSlotId: '15',
    appointmentRescheduleEnabled: false,
    updatedBy: UserType.System,
  }

  const assistantAppointmentTrack = {
    stateUpdateTime: new Date(),
    state: AppointmentStatus.CaseHistoryPending,
    appointmentDate: 'appointmentDate',
    appointmentSlotId: '15',
    appointmentRescheduleEnabled: false,
    updatedBy: UserType.System,
  }
  const appointmentConfig = Appointment.build({
    id,
    consultantId: 'string',
    customerId: 'string',
    creatorId: 'string',
    appointmentSlotId: 3,
    parentId: id,
    createdBy: 'UserType.CustomerSupport',
    consultationType: ConsultationType.Diabetologist,
    appointmentDate: 'string',
    appointmentPaymentStatus: AppointmentPaymentStatus.Blocked,
    appointmentCreationTime: new Date(),
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    appointmentTimeLine: [appointmentTrack],
    assistantAppointmentTimeLine: [assistantAppointmentTrack],
    expirationDate: new Date(),
    basePriceInINR: 500,
    assistantId: 'string',
    appointmentStatus: AppointmentStatus.CaseHistoryPending,
    assistantAppointmentDate: 'string',
    assistantAppointmentSlotId: '15',
    assistantConsecutiveBookedSlots: 1,
    appointmentRescheduleEnabled: false,
    orderType: OrderType.PaidAppointment,
    orderStatus: OrderStatus.Created,
    rescheduleSerialNumber: 0,
    assistantNotRequired: false
  });
  await appointmentConfig.save();
  expect(appointmentConfig.version).toEqual(0);
  await appointmentConfig.save();
  expect(appointmentConfig.version).toEqual(1);
  await appointmentConfig.save();
  expect(appointmentConfig.version).toEqual(2);
});

