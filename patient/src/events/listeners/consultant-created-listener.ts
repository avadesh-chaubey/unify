import { Listener, ConsultantCreatedEvent, Subjects, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { Consultant } from '../../models/consultant';
import { consultantCreatedGroupName } from './queue-group-name';

export class ConsultantCreatedListener extends Listener<ConsultantCreatedEvent> {
  subject: Subjects.ConsultantCreated = Subjects.ConsultantCreated;
  queueGroupName = consultantCreatedGroupName;

  async onMessage(data: ConsultantCreatedEvent['data'], msg: Message) {
    console.log('ConsultantCreatedListener Received for id: ', data.id);

    console.log(data);

    let consultant = await Consultant.findById(data.id)

    if (consultant) {
      console.log('Consultant already exists with id: ' + data.id);
      msg.ack();
      return;
    }

    if (data.userType == UserType.Diabetologist
      || data.userType == UserType.Dietician
      || data.userType == UserType.Educator
      || data.userType == UserType.PhysicianAssistant
      || data.userType == UserType.Doctor) {
      // Create a candidate  
      consultant = Consultant.build({
        id: data.id,
        userFirstName: data.userFirstName,
        userLastName: data.userLastName,
        emailId: data.emailId,
        phoneNumber: data.phoneNumber,
        partnerId: data.partnerId,
        userStatus: data.userStatus,
        userType: data.userType,
        dateOfBirth: data.dateOfBirth,
        experinceInYears: data.experinceInYears,
        qualificationList: data.qualificationList,
        department: data.department,
        specialization: data.specialization,
        profileImageName: data.profileImageName ? data.profileImageName : "defaultProfileImage.png",
        designation: data.designation,
        displayProfileImageName: data.profileImageName ? data.profileImageName : "defaultProfileImage.png",
        displayDesignation: data.designation,
        displayQualification: data.qualificationList.length > 0 ? String(data.qualificationList) : "Graduation",
        displayAdditionalInformation: "NA",
        onboardingDate: new Date(),
        consultationChargesInINR: data.consultationChargesInINR,
        doctorRegistrationNumber: data.doctorRegistrationNumber
      });
      await consultant.save();
    }

    msg.ack();
  }
}; 
