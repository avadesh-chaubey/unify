import { FileStorage } from '../file-storage';
import mongoose from 'mongoose';
import { FileType } from '@unifycaredigital/aem';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a profile
  const id = new mongoose.Types.ObjectId().toHexString();
  const file = FileStorage.build({
    id,
    userId: 'string',
    userType: 'string',
    partnerId: 'string',
    fileType: FileType.ANY,
    fileName: 'string',
  });

  // Save the profile to the database
  await file.save();

  // fetch the profile twice
  const firstInstance = await FileStorage.findById(file.id);
  const secondInstance = await FileStorage.findById(file.id);

  // make two separate changes to the profiles we fetched
  firstInstance!.set({ fileName: 'ashutosh' });
  secondInstance!.set({ fileName: 'dhiman' });

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
  const file = FileStorage.build({
    id,
    userId: 'string',
    userType: 'string',
    partnerId: 'string',
    fileType: FileType.ANY,
    fileName: 'string',
  });

  await file.save();
  expect(file.version).toEqual(0);
  await file.save();
  expect(file.version).toEqual(1);
  await file.save();
  expect(file.version).toEqual(2);
});
