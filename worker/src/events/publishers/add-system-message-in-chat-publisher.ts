import {
  Subjects,
  Publisher,
  AddSystemMessageInChatGroupEvent,
} from '@unifycaredigital/aem';

export class AddSystemMessageInChatGrouPublisher extends Publisher<
  AddSystemMessageInChatGroupEvent
  > {
  subject: Subjects.AddSystemMessageInChatGroup = Subjects.AddSystemMessageInChatGroup;
}
