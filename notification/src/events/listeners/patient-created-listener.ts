import { Listener, PatientCreatedEvent, RelationshipType, Subjects, UserStatus, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { User } from '../../models/user';
import { patientCreatedGroupName } from './queue-group-name';

export class PatientCreatedListener extends Listener<PatientCreatedEvent> {
  subject: Subjects.PatientCreated = Subjects.PatientCreated;
  queueGroupName = patientCreatedGroupName;

  async onMessage(data: PatientCreatedEvent['data'], msg: Message) {
    console.log('PatientCreatedEvent Received for id: ', data.id);

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
