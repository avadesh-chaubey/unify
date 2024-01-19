import { Listener, FamilyMemberCreatedEvent, Subjects, UserStatus, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { User } from '../../models/user';
import { familyMemberCreatedGroupName } from './queue-group-name';

export class FamilyMemberCreatedListener extends Listener<FamilyMemberCreatedEvent> {
  subject: Subjects.FamilyMemberCreated = Subjects.FamilyMemberCreated;
  queueGroupName = familyMemberCreatedGroupName;

  async onMessage(data: FamilyMemberCreatedEvent['data'], msg: Message) {
    console.log('FamilyMemberCreatedEvent Received for id: ', data.id);

    let user = await User.findById(data.id)

    if (!user) {

      user = User.build({
        id: data.id,
        userName: data.userFirstName + " " + data.userLastName,
        emailId: data.emailId,
        phoneNumber: data.phoneNumber,
        partnerId: data.partnerId,
        userStatus: UserStatus.Active,
        userType: UserType.Patient,
        parentId: data.id,
        onboardingDate: new Date()
      });
      await user.save();
    }
    msg.ack();
  }
};
