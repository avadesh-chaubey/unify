import Queue from 'bull';
import { AddChatGroupPublisher } from '../events/publishers/add-chat-group-publisher';
import { RemoveChatGroupPublisher } from '../events/publishers/remove-chat-group-publisher';
import { AddSystemMessageInChatGrouPublisher } from '../events/publishers/add-system-message-in-chat-publisher';
import { natsWrapper } from '../nats-wrapper';
import { ChatGroupActionType } from '@unifycaredigital/aem';

interface Payload {
  appointmentId: string;
  patientId: string;
  consultantId: string;
  assistantId: string;
  appointmentDate: string;
  appointmentSlotId: number;
  remarks: string;
  chatGroupAction: ChatGroupActionType;
  dateAndTime: Date;
  parentId: string;
  patientName: string;
  consultantName: string;
  assistantName: string;
  parentName: string;
  parentEmailId: string;
  consultantEmailId: string;
  assistantEmailId: string;
}

const updateAppointmentChatGroupQueue = new Queue<Payload>('update:appointment:chat:group', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

updateAppointmentChatGroupQueue.process((job, done) => {
  if (job.data.chatGroupAction === ChatGroupActionType.ADDCHATGROUP) {
    new AddChatGroupPublisher(natsWrapper.client).publish({
      appointmentId: job.data.appointmentId,
      patientId: job.data.patientId,
      consultantId: job.data.consultantId,
      assistantId: job.data.assistantId,
      appointmentDate: job.data.appointmentDate,
      appointmentSlotId: job.data.appointmentSlotId,
      remarks: job.data.remarks,
      dateAndTime: job.data.dateAndTime,
      parentId: job.data.parentId,
      patientName: job.data.patientName,
      consultantName: job.data.consultantName,
      assistantName: job.data.assistantName,
      parentName: job.data.parentName,
      parentEmailId: job.data.parentEmailId,
      consultantEmailId: job.data.consultantEmailId,
      assistantEmailId: job.data.assistantEmailId,

    });
  } else if (job.data.chatGroupAction === ChatGroupActionType.REMOVECHATGROUP) {
    new RemoveChatGroupPublisher(natsWrapper.client).publish({
      appointmentId: job.data.appointmentId,
      patientId: job.data.patientId,
      consultantId: job.data.consultantId,
      assistantId: job.data.assistantId,
      appointmentDate: job.data.appointmentDate,
      appointmentSlotId: job.data.appointmentSlotId,
      remarks: job.data.remarks,
      dateAndTime: job.data.dateAndTime,
      parentId: job.data.parentId,
    });
  } else {
    new AddSystemMessageInChatGrouPublisher(natsWrapper.client).publish({
      appointmentId: job.data.appointmentId,
      patientId: job.data.parentId,
      consultantId: job.data.consultantId,
      assistantId: job.data.assistantId,
      appointmentDate: job.data.appointmentDate,
      appointmentSlotId: job.data.appointmentSlotId,
      remarks: job.data.remarks,
      dateAndTime: new Date()
    });
  }
  done();
});

export { updateAppointmentChatGroupQueue };
