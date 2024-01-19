import { Listener, AddChatGroupEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { addChatGroupName } from './queue-group-name';
import { fbDatabase } from '../../firebase';
import { Appointment } from '../../models/appointment';

export class AddChatGroupListener extends Listener<AddChatGroupEvent> {
  subject: Subjects.AddChatGroup = Subjects.AddChatGroup;
  queueGroupName = addChatGroupName;

  async onMessage(data: AddChatGroupEvent['data'], msg: Message) {
    console.log('AddChatGroupEvent Received for patient id: ', data.patientId);

    const appointment = await Appointment.findById(data.appointmentId);
    if (!appointment) {
      msg.ack();
      console.error("Appointment Not Found for Id: " + data.appointmentId);
      return;
    }

    //update Appointment Data
    appointment.set({
      consultantName: data.consultantName,
      assistantName: data.assistantName,
      parentName: data.parentName,
      parentEmailId: data.parentEmailId,
      consultantEmailId: data.consultantEmailId,
      assistantEmailId: data.assistantEmailId
    });
    await appointment.save();

    const uniqueId = data.appointmentId;

    let consultMessage = {
      type: 'text',
      text: data.remarks,
      createdAt: new Date().getTime(),
      system: true,
    };

    fbDatabase.ref('conversations/' + uniqueId + '/members/' + appointment.parentId).set(true);

    fbDatabase.ref('conversations/' + uniqueId + '/members/' + appointment.consultantId).set(true);

    if (appointment.assistantId && appointment.assistantId !== 'NA') {
      fbDatabase.ref('conversations/' + uniqueId + '/members/' + appointment.assistantId).set(true);
    }

    fbDatabase.ref('conversations/' + uniqueId + '/messages').push().set(consultMessage);

    msg.ack();
  }
}; 
