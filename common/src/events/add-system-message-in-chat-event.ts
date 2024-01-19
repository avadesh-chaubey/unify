import { Subjects } from './subjects';

export interface AddSystemMessageInChatGroupEvent {
  subject: Subjects.AddSystemMessageInChatGroup;
  data: {
    patientId: string,
    consultantId: string;
    appointmentId: string;
    assistantId: string;
    appointmentDate: string;
    appointmentSlotId: number;
    remarks: string;
    dateAndTime: Date;
  };
}
