import { Subjects } from './subjects';

export interface AddNewAssistantInChatGroupEvent {
  subject: Subjects.AddNewAssistantInChatGroup;
  data: {
    appointmentId: string;
    assistantId: string;
    assistantName: string;
    assistantEmailId: string;
  };
}
