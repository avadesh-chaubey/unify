import { Publisher, Subjects, UpdateAppointmentChatGroupEvent } from '@unifycaredigital/aem';

export class UpdateAppointmentChatGroupPublisher extends Publisher<UpdateAppointmentChatGroupEvent> {
  subject: Subjects.UpdateAppointmentChatGroup = Subjects.UpdateAppointmentChatGroup;
}
