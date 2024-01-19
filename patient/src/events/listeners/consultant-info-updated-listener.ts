import { Listener, ConsultantInfoUpdatedEvent, Subjects, UserType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { Consultant } from '../../models/consultant';
import { consultantInfoUpdatedGroupName } from './queue-group-name';

export class ConsultantInfoUpdatedListener extends Listener<ConsultantInfoUpdatedEvent> {
  subject: Subjects.ConsultantInfoUpdated = Subjects.ConsultantInfoUpdated;
  queueGroupName = consultantInfoUpdatedGroupName;

  async onMessage(data: ConsultantInfoUpdatedEvent['data'], msg: Message) {
    console.log('ConsultantInfoUpdatedEvent Received for id: ', data.id);

    if (data.id == '60110248d311fb0019af1db0' || data.id == '601285d0daa1010018dcfe68') {
      msg.ack();
      return;
    }

    let consultant = await Consultant.findById(data.id)



    if (consultant) {
      if (data.userType == UserType.Diabetologist
        || data.userType == UserType.Dietician
        || data.userType == UserType.Educator
        || data.userType == UserType.PhysicianAssistant
        || data.userType == UserType.Doctor) {
        // Create a candidate  
        consultant.set({
          userFirstName: data.userFirstName,
          userLastName: data.userLastName,
          partnerId: data.partnerId,
          userStatus: data.userStatus,
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
          consultationChargesInINR: data.consultationChargesInINR,
          doctorRegistrationNumber: data.doctorRegistrationNumber
        });
        await consultant.save();
      }
    }
    msg.ack();
  }
}; 
