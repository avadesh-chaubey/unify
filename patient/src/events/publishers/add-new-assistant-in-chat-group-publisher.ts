import { Publisher, Subjects, AddNewAssistantInChatGroupEvent } from '@unifycaredigital/aem';

export class AddNewAssistantInChatGroupPublisher extends Publisher<AddNewAssistantInChatGroupEvent> {
  subject: Subjects.AddNewAssistantInChatGroup = Subjects.AddNewAssistantInChatGroup;
}
