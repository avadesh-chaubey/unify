import Queue from 'bull';
import { DatabaseUploadPublisher } from '../events/publishers/database-upload-publisher';
import { natsWrapper } from '../nats-wrapper';
import moment from 'moment';

interface Payload {
  id: string;
}

const uploadDatabaseQueue = new Queue<Payload>('database:upload', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

uploadDatabaseQueue.process((job, done) => {
  console.log("uploadDatabaseQueue event Published at " + (new Date()));


  const currentYear = moment().utcOffset(330).format('YYYY');
  const currentMonth = moment().utcOffset(330).format('MMMM');

  new DatabaseUploadPublisher(natsWrapper.client).publish({
    backupFilePrifix: moment().utcOffset(330).format('YYYY-MM-DD') + "_",
    localBackupDirectory: process.env.LOCAL_BACKUP_DIRECTORY + '',
    serverBackupDirectory: process.env.SERVER_BACKUP_DIRECTORY + '/' + currentYear + '_' + currentMonth,
  });
  done();
});

export { uploadDatabaseQueue };
