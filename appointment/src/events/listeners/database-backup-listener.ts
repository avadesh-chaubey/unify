import { Message } from 'node-nats-streaming';
import { Listener, DatabaseBackupEvent, Subjects } from '@unifycaredigital/aem';
import { databasBackupGroupName } from './queue-group-name';

var path = require('path');

//var backup = require('mongodb-backup');
import { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } from 'mongodb-snapshot';
var fs = require('fs');

export class DatabaseBackupListener extends Listener<DatabaseBackupEvent> {
  subject: Subjects.DatabaseBackup = Subjects.DatabaseBackup;
  queueGroupName = databasBackupGroupName;

  async onMessage(data: DatabaseBackupEvent['data'], msg: Message) {

    //It's time taking job so ack msg as soon as it is received
    msg.ack();
    var dataBackupDir = data.localBackupDirectory;

    try {
      if (!fs.existsSync(dataBackupDir)) {
        // Create the directory if it does not exist
        fs.mkdirSync(dataBackupDir);
      }
    } catch (err) {
      console.error(err)
      return;
    }

    const backupFileName = data.backupFilePrifix + process.env.DATABACKUP_TAR_FILENAME;

    console.log(backupFileName);

    var finalFileName = path.join(dataBackupDir, backupFileName);

    async function dumpMongo2Localfile(backupFileName: string) {
      const mongo_connector = new MongoDBDuplexConnector({
        connection: {
          uri: String(process.env.MONGO_URI),
          dbname: 'appointment',
        },
      });

      const localfile_connector = new LocalFileSystemDuplexConnector({
        connection: {
          path: `./${finalFileName}`,
        },
      });

      const transferer = new MongoTransferer({
        source: mongo_connector,
        targets: [localfile_connector],
      });

      for await (const { total, write } of transferer) {
        console.log(`remaining bytes to write: ${total - write}`);
      }
    }

    //Create Dump File of MongoDB Database
    await dumpMongo2Localfile(backupFileName);
  }
}
