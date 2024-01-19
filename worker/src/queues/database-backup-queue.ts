import Queue from 'bull';
import { DatabaseBackupPublisher } from '../events/publishers/database-backup-publisher';
import { natsWrapper } from '../nats-wrapper';
import moment from 'moment';

interface Payload {
  id: string;
}

const backupDatabaseQueue = new Queue<Payload>('database:backup', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

backupDatabaseQueue.process((job, done) => {
  console.log("backupDatabaseQueue event Published at " + (new Date()));

  const currentYear = moment().utcOffset(330).format('YYYY');
  const currentMonth = moment().utcOffset(330).format('MMMM');

  new DatabaseBackupPublisher(natsWrapper.client).publish({
    backupFilePrifix: moment().utcOffset(330).format('YYYY-MM-DD') + "_",
    localBackupDirectory: process.env.LOCAL_BACKUP_DIRECTORY + '',
    serverBackupDirectory: process.env.SERVER_BACKUP_DIRECTORY + '/' + currentYear + '_' + currentMonth,
  });
  done();
});

export { backupDatabaseQueue };
