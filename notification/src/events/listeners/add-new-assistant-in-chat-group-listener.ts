import { Listener, AddNewAssistantInChatGroupEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { addNewAssistantInChatGroupName } from './queue-group-name';
import { fbDatabase } from '../../firebase';
import { Appointment } from '../../models/appointment';

export class AddNewAssistantInChatGroupListener extends Listener<AddNewAssistantInChatGroupEvent> {
  subject: Subjects.AddNewAssistantInChatGroup = Subjects.AddNewAssistantInChatGroup;
  queueGroupName = addNewAssistantInChatGroupName;

  async onMessage(data: AddNewAssistantInChatGroupEvent['data'], msg: Message) {
    console.log('AddNewAssistantInChatGroupEvent Received for Appointment id: ', data.appointmentId);

    const appointment = await Appointment.findById(data.appointmentId);
    if (!appointment) {
      msg.ack();
      console.error("Appointment Not Found for Id: " + data.appointmentId);
      return;
    }

    const oldAssistantId = appointment.assistantId;

    //update Appointment Data
    appointment.set({
      assistantName: data.assistantName,
      assistantEmailId: data.assistantEmailId,
      assistantId: data.assistantId
    });
    await appointment.save();

    const uniqueId = data.appointmentId;

    fbDatabase.ref('conversations/' + uniqueId + '/members/' + oldAssistantId).set(false);

    fbDatabase.ref('conversations/' + uniqueId + '/members/' + appointment.assistantId).set(true);

    msg.ack();
  }
}; 
