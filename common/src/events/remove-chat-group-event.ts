import { Subjects } from './subjects';

export interface RemoveChatGroupEvent {
  subject: Subjects.RemoveChatGroup;
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
  };
}
