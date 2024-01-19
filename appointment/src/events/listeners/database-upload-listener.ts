import { Message } from 'node-nats-streaming';
import { Listener, DatabaseUploadEvent, Subjects } from '@unifycaredigital/aem';
import { databasUploadGroupName } from './queue-group-name';

const { GcsFileUpload } = require('gcs-file-upload')

var fs = require('fs');
var path = require('path');

export class DatabaseUploadListener extends Listener<DatabaseUploadEvent> {
  subject: Subjects.DatabaseUpload = Subjects.DatabaseUpload;
  queueGroupName = databasUploadGroupName;

  async onMessage(data: DatabaseUploadEvent['data'], msg: Message) {

    console.log("DatabaseUploadEvent received");

    //It's time taking job so ack msg as soon as it is received
    msg.ack();

    var dataBackupDir = data.localBackupDirectory;

    const backupFileName = data.backupFilePrifix + process.env.DATABACKUP_TAR_FILENAME;

    const file = path.join(dataBackupDir, backupFileName)

    const myBucket = new GcsFileUpload({
      keyFilename: "key.json",
      projectId: process.env.GCLOUD_PROJECT,
    }, process.env.GCS_BUCKET)

    const uploadPath = path.join(data.serverBackupDirectory, backupFileName)

    let backupFile = null;
    try {
      backupFile = fs.readFileSync(`./${file}`)
    } catch (err) {
      console.error(err)
      return;
    }

    const fileMetaData = {
      originalname: uploadPath,
      buffer: backupFile
    }

    await myBucket
      .uploadFile(fileMetaData, {
        gzip: true,
      })
      .then((data: any) => {
        console.log(uploadPath + " backup file uploaded")
      })
      .catch((err: any) => {
        console.log(err)
      })
  }
}
