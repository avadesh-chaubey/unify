import { Listener, PartnerSuperuserStatusChangedEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { User } from '../../models/user-auth';
import { partnerSuperuserStatusChangedGroupName } from './queue-group-name';

export class PartnerSuperuserStatusChangedListener extends Listener<PartnerSuperuserStatusChangedEvent> {
  subject: Subjects.PartnerSuperuserStatusUpdated = Subjects.PartnerSuperuserStatusUpdated;
  queueGroupName = partnerSuperuserStatusChangedGroupName;

  async onMessage(data: PartnerSuperuserStatusChangedEvent['data'], msg: Message) {
    console.log('PartnerUpdateEvent Received for id: ', data.id);

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
