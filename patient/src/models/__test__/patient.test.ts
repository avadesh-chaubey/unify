import { Patient } from '../patient';
import mongoose from 'mongoose';
import { GenderType, RelationshipType } from '@unifycaredigital/aem';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();
  const patient = Patient.build({
    id,
    userFirstName: 'Ashutosh',
    userLastName: 'Dhiman',
    emailId: 'ashutosh@test.com',
    phoneNumber: '6666666666',
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    dateOfBirth: '24-09-1980',
    gender: GenderType.Male,
    relationship: RelationshipType.Self,
    profileImageName: 'string',
    parentId: id,
    upcomingAppointmentDate: new Date().toString(),
    followupConsultationDate: new Date().toString(),
    mhrId: 'ARH00112',
    languages: ["Hindi"],
    address: "address",
    city: "Delhi",
    state: "Delhi",
    pin: "110060",
    freeDieticianConsultations: 0,
    freeEducatorConsultations: 0,
    freeDiabetologistConsultations: 0,
    parentName: 'Ashutosh Dhiman'
  });

  // Save the profile to the database
  await patient.save();

  // fetch the profile twice
  const firstInstance = await Patient.findById(patient.id);
  const secondInstance = await Patient.findById(patient.id);

  // make two separate changes to the profiles we fetched
  firstInstance!.set({ phoneNumber: '1010101010' });
  secondInstance!.set({ phoneNumber: '1515151515' });

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
  const patient = Patient.build({
    id,
    userFirstName: 'Ashutosh',
    userLastName: 'Dhiman',
    emailId: 'ashutosh@test.com',
    phoneNumber: '6666666666',
    partnerId: new mongoose.Types.ObjectId().toHexString(),
    dateOfBirth: '24-09-1980',
    gender: GenderType.Male,
    relationship: RelationshipType.Self,
    profileImageName: 'string',
    parentId: id,
    upcomingAppointmentDate: new Date().toString(),
    followupConsultationDate: new Date().toString(),
    mhrId: 'ARH00112',
    languages: ["Hindi"],
    address: "address",
    city: "Delhi",
    state: "Delhi",
    pin: "110060",
    freeDieticianConsultations: 0,
    freeEducatorConsultations: 0,
    freeDiabetologistConsultations: 0,
    parentName: 'Ashutosh Dhiman'
  });

  await patient.save();
  expect(patient.version).toEqual(0);
  await patient.save();
  expect(patient.version).toEqual(1);
  await patient.save();
  expect(patient.version).toEqual(2);
});
