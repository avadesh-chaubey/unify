import { Listener, ConsultantCreatedEvent, Subjects, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { User } from '../../models/user';
import { consultantCreatedGroupName } from './queue-group-name';
export class ConsultantCreatedListener extends Listener<ConsultantCreatedEvent> {
  subject: Subjects.ConsultantCreated = Subjects.ConsultantCreated;
  queueGroupName = consultantCreatedGroupName;

  async onMessage(data: ConsultantCreatedEvent['data'], msg: Message) {
    console.log('ConsultantCreatedListener Received for id: ', data.id);

    console.log(data);

    let user = await User.findById(data.id)

    if (!user) {
      user = User.build({
        id: data.id,
        userName: data.userFirstName + " " + data.userLastName,
        emailId: data.emailId,
        phoneNumber: data.phoneNumber,
        partnerId: data.partnerId,
        userStatus: data.userStatus,
        userType: data.userType,
        parentId: data.id,
        onboardingDate: new Date()
      });
      await user.save();
    }


    msg.ack();
  }
};
