import { Listener, ConsultantCreatedEvent, Subjects, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { Consultant } from '../../models/consultant';
import { partnerEmployeeCreatedGroupName } from './queue-group-name';

export class ConsultantCreatedListener extends Listener<ConsultantCreatedEvent> {
  subject: Subjects.ConsultantCreated = Subjects.ConsultantCreated;
  queueGroupName = partnerEmployeeCreatedGroupName;

  async onMessage(data: ConsultantCreatedEvent['data'], msg: Message) {
    console.log('ConsultantCreatedEvent Received for id: ', data.id);

    if (data.userType === UserType.PartnerRosterManager) {
      msg.ack();
      return;
    }

    let employee = await Consultant.findById(data.id)
    if (employee) {
      msg.ack();
      return;
    }

    employee = Consultant.build({
      id: data.id,
      userFirstName: data.userFirstName,
      userLastName: data.userLastName,
      emailId: data.emailId,
      phoneNumber: data.phoneNumber,
      userStatus: data.userStatus,
      userType: data.userType,
      partnerId: data.partnerId,
      consultationChargesInINR: data.consultationChargesInINR,
      locationBasedFeeConfig: data.locationBasedFeeConfig,
      about: data.about,
      qualificationList: data.qualificationList,
      specialization: data.specialization,
      profileImageName: data.profileImageName,
      experinceInYears: data.experinceInYears
    });
    await employee.save();
    msg.ack();
  }
};
