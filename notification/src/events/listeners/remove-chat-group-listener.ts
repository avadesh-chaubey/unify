import { Listener, RemoveChatGroupEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { removeChatGroupName } from './queue-group-name';
import { fbDatabase } from '../../firebase';
import { Appointment } from '../../models/appointment';

export class RemoveChatGroupListener extends Listener<RemoveChatGroupEvent> {
  subject: Subjects.RemoveChatGroup = Subjects.RemoveChatGroup;
  queueGroupName = removeChatGroupName;

  async onMessage(data: RemoveChatGroupEvent['data'], msg: Message) {
    console.log('RemoveChatGroupEvent Received for Appointment id: ', data.appointmentId);

    const appointment = await Appointment.findById(data.appointmentId);
    if (!appointment) {
      msg.ack();
      console.error("Appointment Not Found for Id: " + data.appointmentId);
      return;
    }

    console.log("Removing all Chat Group Premissions Appointment Date: " + appointment.appointmentDate + " Today: " + new Date());

    const uniqueId = data.appointmentId;

    fbDatabase.ref('conversations/' + uniqueId + '/members/' + appointment.parentId).set(false);

    fbDatabase.ref('conversations/' + uniqueId + '/members/' + appointment.consultantId).set(false);

    if (data.assistantId && data.assistantId !== 'NA') {
      fbDatabase.ref('conversations/' + uniqueId + '/members/' + appointment.assistantId).set(false);
    }

    msg.ack();
  }
}; 
