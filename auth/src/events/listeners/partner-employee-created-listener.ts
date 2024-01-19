import { Listener, PartnerEmployeeCreatedEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { User } from '../../models/user-auth';
import { partnerEmployeeCreatedGroupName } from './queue-group-name';

export class PartnerEmployeeCreatedListener extends Listener<PartnerEmployeeCreatedEvent> {
  subject: Subjects.PartnerEmployeeCreated = Subjects.PartnerEmployeeCreated;
  queueGroupName = partnerEmployeeCreatedGroupName;

  async onMessage(data: PartnerEmployeeCreatedEvent['data'], msg: Message) {
    console.log('PartnerEmployeeCreatedEvent Received for id: ', data.id);

    let employee = await User.findById(data.id);

    if (employee) {
      msg.ack();
      return;
    }

    // Create a candidate
    employee = User.build({
      id: data.id,
      userFirstName: data.userFirstName,
      userLastName: data.userLastName,
      emailId: data.emailId,
      password: data.emailId,
      lastAuthAt: new Date(),
      phoneNumber: data.phoneNumber,
      partnerId: data.partnerId,
      userStatus: data.userStatus,
      accessLevel: data.accessLevel,
      userType: data.userType,
      registrationTimeAndDate: new Date(),
      pin: 'NA',
      employeeId: data.employeeId
    });
    await employee.save();

    msg.ack();
  }
};
