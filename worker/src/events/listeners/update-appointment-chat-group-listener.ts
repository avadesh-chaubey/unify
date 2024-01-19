import { updateAppointmentChatGroup } from './queue-group-name';
import { updateAppointmentChatGroupQueue } from '../../queues/update-appointment-chat-group-queue';
import { appointmentReminderQueue } from '../../queues/appointment-reminder-queue';
import { Message } from 'node-nats-streaming';
import { Listener, UpdateAppointmentChatGroupEvent, Subjects, ChatGroupActionType } from '@unifycaredigital/aem';

export class UpdateAppointmentChatGroupListener extends Listener<UpdateAppointmentChatGroupEvent> {
  subject: Subjects.UpdateAppointmentChatGroup = Subjects.UpdateAppointmentChatGroup;
  queueGroupName = updateAppointmentChatGroup;

  async onMessage(data: UpdateAppointmentChatGroupEvent['data'], msg: Message) {

    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);

    let delay = new Date(data.updateChatGroupAtTime).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to update chat group:', delay);

    if (delay < 0) {
      console.log(`${data.chatGroupAction} received with delay ${delay}`);
      msg.ack();
      return
    }

    if (data.chatGroupAction === ChatGroupActionType.REMOVECHATGROUP) {
      delay = 1000; //fixing to 1 sec for now
      try {
        await updateAppointmentChatGroupQueue.add(
          {
            appointmentId: data.appointmentId,
            patientId: data.patientId,
            consultantId: data.consultantId,
            appointmentDate: data.appointmentDate,
            assistantId: data.assistantId,
            appointmentSlotId: data.appointmentSlotId,
            remarks: data.remarks,
            chatGroupAction: ChatGroupActionType.ADDSYSTEMMESSAGE,
            dateAndTime: new Date(),
            parentId: data.parentId,
            patientName: data.patientName,
            consultantName: data.consultantName,
            assistantName: data.assistantName,
            parentName: data.parentName,
            parentEmailId: data.parentEmailId,
            consultantEmailId: data.consultantEmailId,
            assistantEmailId: data.assistantEmailId
          },
          {
            delay,
          }
        );
      } catch (error) {
        console.error(error);
      }
      delay = new Date(data.updateChatGroupAtTime).getTime() - new Date().getTime();
    } else if (data.chatGroupAction === ChatGroupActionType.ADDCHATGROUP) {
      //Add Appointment reminder
      delay = new Date(data.updateChatGroupAtTime).getTime() - new Date().getTime() - ISTOffset * 60000;
      console.log('Waiting this many milliseconds to reminder update:' + delay + " " + new Date(new Date().getTime() + delay));
      try {
        await appointmentReminderQueue.add(
          {
            appointmentId: data.appointmentId,
          },
          {
            delay,
          }
        );
      } catch (error) {
        console.error(error);
      }
      delay = 1000; //fixing to 1 sec for now
    } else {
      delay = 1000; //fixing to 1 sec for now
    }

    try {
      await updateAppointmentChatGroupQueue.add(
        {
          appointmentId: data.appointmentId,
          patientId: data.patientId,
          consultantId: data.consultantId,
          appointmentDate: data.appointmentDate,
          assistantId: data.assistantId,
          appointmentSlotId: data.appointmentSlotId,
          remarks: data.remarks,
          chatGroupAction: data.chatGroupAction,
          dateAndTime: new Date(),
          parentId: data.parentId,
          patientName: data.patientName,
          consultantName: data.consultantName,
          assistantName: data.assistantName,
          parentName: data.parentName,
          parentEmailId: data.parentEmailId,
          consultantEmailId: data.consultantEmailId,
          assistantEmailId: data.assistantEmailId
        },
        {
          delay,
        }
      );
      msg.ack();
    } catch (error) {
      msg.ack();
      console.error(error);
    }
    msg.ack();
  }
}
