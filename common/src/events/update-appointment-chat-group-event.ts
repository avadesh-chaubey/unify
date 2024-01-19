import { Subjects } from './subjects';
import { ChatGroupActionType } from '../types/chat-group-action-type'

export interface UpdateAppointmentChatGroupEvent {
  subject: Subjects.UpdateAppointmentChatGroup;
  data: {
    appointmentId: string;
    patientId: string;
    consultantId: string;
    assistantId: string;
    appointmentDate: string;
    appointmentSlotId: number;
    remarks: string;
    chatGroupAction: ChatGroupActionType;
    updateChatGroupAtTime: Date;
    parentId: string;
    patientName: string;
    consultantName: string;
    assistantName: string;
    parentName: string;
    consultantEmailId: string;
    assistantEmailId: string;
    parentEmailId: string;
  };
}