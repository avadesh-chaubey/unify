import { Subjects } from './subjects';

export interface DatabaseBackupEvent {
  subject: Subjects.DatabaseBackup;
  data: {
    backupFilePrifix: string;
    localBackupDirectory: string;
    serverBackupDirectory: string;
  };
}