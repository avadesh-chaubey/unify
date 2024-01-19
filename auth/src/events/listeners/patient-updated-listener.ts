import { Listener, PatientUpdatedEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { User } from '../../models/user-auth';
import { patientStatusChangedGroupName } from './queue-group-name';

export class PatientStatusChangedListener extends Listener<PatientUpdatedEvent> {
  subject: Subjects.PatientUpdated = Subjects.PatientUpdated;
  queueGroupName = patientStatusChangedGroupName;

  async onMessage(data: PatientUpdatedEvent['data'], msg: Message) {
    console.log('PatientUpdatedEvent Received for id: ', data.id);

    const company = await User.findById(data.id);
    if (!company) {
      msg.ack();
      return;
    }
    company.set({
      userStatus: data.userStatus,
    });
    await company.save();

    msg.ack();
  }
};