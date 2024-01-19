import { Listener, PatientCreatedEvent, RelationshipType, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { PartnerInformation } from '../../models/partner-information';
import { Patient } from '../../models/patient';
import { patientCreatedGroupName } from './queue-group-name';

export class PatientCreatedListener extends Listener<PatientCreatedEvent> {
  subject: Subjects.PatientCreated = Subjects.PatientCreated;
  queueGroupName = patientCreatedGroupName;

  async onMessage(data: PatientCreatedEvent['data'], msg: Message) {
    console.log('PatientCreatedEvent Received for id: ', data.id);

    let patient = await Patient.findById(data.id);

    if (patient) {
      msg.ack();
      return;
    }

    const partnerInfo = await PartnerInformation.findOne({ ownerOrganisationUID: data.ownerOrganisationUID });
    let branch = '';
    if (partnerInfo) {
      branch = partnerInfo.legalName + ' ' + partnerInfo.addressLine1 + ' ' + partnerInfo.city + ' ' + partnerInfo.state + ' ' + partnerInfo.country + ' ' + partnerInfo.pincode;
    }
    // Create a Patient  
    patient = Patient.build({
      id: data.id,
      patientUID: 'NA',
      userFirstName: data.userFirstName,
      userMiddleName: 'NA',
      ownerOrganisationUID: data.ownerOrganisationUID,
      userLastName: data.userLastName,
      emailId: data.emailId,
      phoneNumber: data.phoneNumber,
      phoneNumber2: 'NA',
      partnerId: data.partnerId,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      motherName: data.userMotherName,
      relationship: RelationshipType.Self,
      profileImageName: "NA",
      parentId: data.id,
      upcomingAppointmentDate: 'NA',
      followupConsultationDate: 'NA',
      mhrId: 'NA',
      languages: data.languages ? data.languages : ["Hindi"],
      address: data.address ? data.address : "NA",
      address2: '',
      city: data.city ? data.city : "NA",
      state: data.state ? data.state : "NA",
      country: data.country,
      area: '',
      pin: data.pin ? data.pin : "NA",
      freeDiabetologistConsultations: 0,
      freeDieticianConsultations: 0,
      freeEducatorConsultations: 0,
      parentName: data.userFirstName + " " + data.userLastName,
      patientPASID: 'NA',
      isVIP: false,
      nationality: 'NA',
      statusFlag: 'NA',
      branchName: branch
      //NEED to save branch information in above branch name
    });
    await patient.save();

    msg.ack();
  }
};
