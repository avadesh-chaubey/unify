import {
  Subjects,
  Publisher,
  DatabaseUploadEvent,
} from '@unifycaredigital/aem';

export class DatabaseUploadPublisher extends Publisher<
  DatabaseUploadEvent
  > {
  subject: Subjects.DatabaseUpload = Subjects.DatabaseUpload;
}
