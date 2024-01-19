import { Listener, PartnerEmployeeCreatedEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { PartnerEmployee } from '../../models/partner-employee';
import { partnerEmployeeCreatedGroupName } from './queue-group-name';

export class PartnerEmployeeCreatedListener extends Listener<PartnerEmployeeCreatedEvent> {
  subject: Subjects.PartnerEmployeeCreated = Subjects.PartnerEmployeeCreated;
  queueGroupName = partnerEmployeeCreatedGroupName;

  async onMessage(data: PartnerEmployeeCreatedEvent['data'], msg: Message) {
    console.log('PartnerEmployeeCreatedEvent Received for id: ', data.id);

    let partnerEmployee = await PartnerEmployee.findById(data.id);

    if (partnerEmployee) {
      msg.ack();
      return;
    }

    // Create a candidate
    partnerEmployee = PartnerEmployee.build({
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
      pin: data.pin,
      employeeId: data.employeeId,
	  specialization: data.specialization,
	  qualificationList: data.qualificationList,
	  experinceInYears: data.experinceInYears,
	  nextAvailableSlot : "NA",
	  organization : data.organization,
	  profileImageName: data.profileImageName,
	  city: data.city,
	  organizationUID: data.organizationUID,
	  specialityUID: data.specialityUID
    });
    await partnerEmployee.save();

    msg.ack();
  }
};
