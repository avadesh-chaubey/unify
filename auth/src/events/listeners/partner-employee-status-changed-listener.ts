import { Listener, PartnerEmployeeStatusChangedEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { User } from '../../models/user-auth';
import { partnerEmployeeStatusChangedGroupName } from './queue-group-name';

export class PartnerEmployeeStatusChangedListener extends Listener<PartnerEmployeeStatusChangedEvent> {
  subject: Subjects.PartnerEmployeeStatusUpdated = Subjects.PartnerEmployeeStatusUpdated;
  queueGroupName = partnerEmployeeStatusChangedGroupName;

  async onMessage(data: PartnerEmployeeStatusChangedEvent['data'], msg: Message) {
    console.log('PartnerEmployeeStatusChangedEvent Received for id: ', data.id);

    const partner = await User.findById(data.id);
    if (!partner) {
      msg.ack();
      return;
    }

    partner.set({
      userStatus: data.userStatus,
    });
    await partner.save();

    msg.ack();
  }
}; 
