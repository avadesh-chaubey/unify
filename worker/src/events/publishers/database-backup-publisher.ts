import {
  Subjects,
  Publisher,
  DatabaseBackupEvent,
} from '@unifycaredigital/aem';

export class DatabaseBackupPublisher extends Publisher<
  DatabaseBackupEvent
  > {
  subject: Subjects.DatabaseBackup = Subjects.DatabaseBackup;
}
