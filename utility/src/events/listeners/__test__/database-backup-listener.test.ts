import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { DatabaseBackupEvent, DatabaseUploadEvent } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { DatabaseBackupListener } from '../database-backup-listener';
import { DatabaseUploadListener } from '../database-upload-listener';
import { FileStorage } from '../../../model/file-storage';
import { FileType } from '@unifycaredigital/aem';
import moment from 'moment'

const setup = async () => {
  // Create an instance of the listener

  const listener = new DatabaseBackupListener(natsWrapper.client);

  const currentYear = moment().utcOffset(330).format('YYYY');
  const currentMonth = moment().utcOffset(330).format('MMMM');

  // Create the fake data event
  const data: DatabaseBackupEvent['data'] = {
    backupFilePrifix: moment().utcOffset(330).format('YYYY-MM-DD') + "_",
    localBackupDirectory: process.env.LOCAL_BACKUP_DIRECTORY + '',
    serverBackupDirectory: process.env.SERVER_BACKUP_DIRECTORY + '/' + currentYear + '_' + currentMonth,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

const setupload = async () => {
  // Create an instance of the listener

  const l = new DatabaseUploadListener(natsWrapper.client);

  const currentYear = moment().utcOffset(330).format('YYYY');
  const currentMonth = moment().utcOffset(330).format('MMMM');

  // Create the fake data event
  const d: DatabaseUploadEvent['data'] = {
    backupFilePrifix: moment().utcOffset(330).format('YYYY-MM-DD') + "_",
    localBackupDirectory: process.env.LOCAL_BACKUP_DIRECTORY + '',
    serverBackupDirectory: process.env.SERVER_BACKUP_DIRECTORY + '/' + currentYear + '_' + currentMonth,
  };

  // @ts-ignore
  const m: Message = {
    ack: jest.fn(),
  };

  return { l, d, m };
};

it('create backup file', async (done) => {
  let id = new mongoose.Types.ObjectId().toHexString();
  let file = FileStorage.build({
    id,
    userId: 'string',
    userType: 'string',
    partnerId: 'string',
    fileType: FileType.ANY,
    fileName: 'string',
  });

  // Save the profile to the database
  await file.save();

  id = new mongoose.Types.ObjectId().toHexString();
  file = FileStorage.build({
    id,
    userId: 'string',
    userType: 'string',
    partnerId: 'string',
    fileType: FileType.ANY,
    fileName: 'string',
  });

  await file.save();

  id = new mongoose.Types.ObjectId().toHexString();
  file = FileStorage.build({
    id,
    userId: 'string',
    userType: 'string',
    partnerId: 'string',
    fileType: FileType.ANY,
    fileName: 'string',
  });

  await file.save();

  id = new mongoose.Types.ObjectId().toHexString();
  file = FileStorage.build({
    id,
    userId: 'string',
    userType: 'string',
    partnerId: 'string',
    fileType: FileType.ANY,
    fileName: 'string',
  });

  // Save the profile to the database
  await file.save();

  // const name = moment().format('YYYY-MM-DD HH:mm').toString();

  // const newname = name.replace(/ /g, "_")

  // const finalname = newname.replace(/:/g, "_")

  // console.log(finalname)

  const entries = await FileStorage.find({});
  expect(entries.length).toEqual(4);

  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

  done();

});

// it('Upload backup file', async (done) => {

//   const { l, d, m } = await setupload();
//   await l.onMessage(d, m);

// }, 10000);

