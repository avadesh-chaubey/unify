import {
  Subjects,
  Publisher,
  AddChatGroupEvent,
} from '@unifycaredigital/aem';

export class AddChatGroupPublisher extends Publisher<
  AddChatGroupEvent
  > {
  subject: Subjects.AddChatGroup = Subjects.AddChatGroup;
}
