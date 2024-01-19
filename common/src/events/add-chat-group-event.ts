import { Subjects } from './subjects';

export interface AddChatGroupEvent {
  subject: Subjects.AddChatGroup;
  data: {
    patientId: string,
    consultantId: string;
    appointmentId: string;
    assistantId: string;
    appointmentDate: string;
    appointmentSlotId: number;
    remarks: string;
    dateAndTime: Date;
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
