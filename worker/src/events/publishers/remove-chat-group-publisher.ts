import {
  Subjects,
  Publisher,
  RemoveChatGroupEvent,
} from '@unifycaredigital/aem';

export class RemoveChatGroupPublisher extends Publisher<
  RemoveChatGroupEvent
  > {
  subject: Subjects.RemoveChatGroup = Subjects.RemoveChatGroup;
}
