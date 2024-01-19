import { Listener, ConsultantInfoUpdatedEvent, Subjects, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { Consultant } from '../../models/consultant';
import { consultantInfoUpdatedGroupName } from './queue-group-name';

export class ConsultantInfoUpdatedListener extends Listener<ConsultantInfoUpdatedEvent> {
  subject: Subjects.ConsultantInfoUpdated = Subjects.ConsultantInfoUpdated;
  queueGroupName = consultantInfoUpdatedGroupName;

  async onMessage(data: ConsultantInfoUpdatedEvent['data'], msg: Message) {
    console.log('ConsultantInfoUpdatedEvent Received for id: ', data.id);

    let consultant = await Consultant.findById(data.id)
    if (consultant) {

      consultant.set({
        consultationChargesInINR: data.consultationChargesInINR,
        locationBasedFeeConfig: data.locationBasedFeeConfig,
        about: data.about,
        qualificationList: data.qualificationList,
        specialization: data.specialization,
        profileImageName: data.profileImageName,
        experinceInYears: data.experinceInYears
      });
      consultant.markModified('locationBasedFeeConfig');
      await consultant.save();
    }

    msg.ack();
  }
};
