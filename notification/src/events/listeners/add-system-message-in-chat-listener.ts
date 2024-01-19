import { Listener, AddSystemMessageInChatGroupEvent, Subjects, ChatMessageType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { addSystemMessageInChatGroupName } from './queue-group-name';
import { fbDatabase } from '../../firebase';

export class AddSystemMessageInChatGroupListener extends Listener<AddSystemMessageInChatGroupEvent> {
  subject: Subjects.AddSystemMessageInChatGroup = Subjects.AddSystemMessageInChatGroup;
  queueGroupName = addSystemMessageInChatGroupName;

  async onMessage(data: AddSystemMessageInChatGroupEvent['data'], msg: Message) {
    console.log('AddSystemMessageInChatGroupEvent Received for Appointment id: ', data.appointmentId);

    let delay = new Date().getTime() - new Date(data.dateAndTime).getTime();

    // older than 30 sec ignore
    if (delay > 30000) {
      console.log(delay + " Return AddSystemMessageInChatGroupEvent with message " + data.remarks);
      msg.ack();
      return;
    }

    const uniqueId = data.appointmentId;

    console.log("adding system msg: " + data.remarks);

    let messagedata = {
      type: 'text',
      text: data.remarks,
      createdAt: new Date().getTime(),
      system: true,
    };
    fbDatabase.ref('conversations/' + uniqueId + '/messages').push().set(messagedata);
    msg.ack();
  }
}; 
