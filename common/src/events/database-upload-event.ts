import { Subjects } from './subjects';

export interface DatabaseUploadEvent {
  subject: Subjects.DatabaseUpload;
  data: {
    backupFilePrifix: string;
    localBackupDirectory: string;
    serverBackupDirectory: string;
  };
}