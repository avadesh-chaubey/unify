import { Listener, ConsultantInfoUpdatedEvent, Subjects, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { User } from '../../models/user';
import { consultantInfoUpdatedGroupName } from './queue-group-name';

export class ConsultantInfoUpdatedListener extends Listener<ConsultantInfoUpdatedEvent> {
  subject: Subjects.ConsultantInfoUpdated = Subjects.ConsultantInfoUpdated;
  queueGroupName = consultantInfoUpdatedGroupName;

  async onMessage(data: ConsultantInfoUpdatedEvent['data'], msg: Message) {
    console.log('ConsultantInfoUpdatedEvent Received for id: ', data.id);

    let consultant = await User.findById(data.id)

    if (consultant) {
      // Create a candidate  
      consultant.set({
        userName: data.userFirstName + " " + data.userLastName,
        userStatus: data.userStatus,
      });
      await consultant.save();
    }
    msg.ack();
  }
}; 
