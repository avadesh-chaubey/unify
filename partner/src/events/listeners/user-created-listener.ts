import { Message } from 'node-nats-streaming';
import { Listener, UserCreatedEvent, Subjects, PartnerStates, PartnerType, GenderType, DepartmentType, SpecializationType, UserType, LocationBasedFeeConfig } from '@unifycaredigital/aem';
import { partnerSuperuserCreatedGroupName } from './queue-group-name';
import { PartnerSuperuser } from '../../models/partner-superuser';
import { PartnerState } from '../../models/partner-state';
import { PartnerEmployee } from '../../models/partner-employee';
import { ConsultantCreatedPublisher } from '../publishers/consultant-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = partnerSuperuserCreatedGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {

    if (data.partnerType === PartnerType.NotApplicable) {
      msg.ack();
      return;
    }

    let employee = await PartnerEmployee.findById(data.id)

    if (employee) {
      msg.ack();
      return;
    }
    const locationBasedFeeConfig: [LocationBasedFeeConfig] = [
      {
        country: 'ANY',
        state: 'ANY',
        city: 'ANY',
        locationConfig: 'ANY#ANY#ANY',
        flatFees: 500,
        feeInPercentage: 100,
        followUpFees: 0,
        appointmentType: 'ANY#ANY#ANY'
      }
    ];

    // Create a candidate
    employee = PartnerEmployee.build({
      id: data.id,
      title: "Mr.",
      userFirstName: data.userFirstName,
      userMiddleName: '',
      userLastName: data.userLastName,
      emailId: data.emailId,
      phoneNumber: data.phoneNumber,
      partnerId: data.partnerId,
      userStatus: data.userStatus,
      accessLevel: data.accessLevel,
      userType: data.userType,
      genderType: GenderType.Male,
      dateOfBirth: '1980-01-01',
      experinceInYears: 1,
      qualificationList: ['Graduate'],
      department: DepartmentType.MedicalDepartment,
      specialization: SpecializationType.Diabetic,
      profileImageName: '',
      designation: '',
      onboardingDate: new Date(),
      languages: ['English'],
      panNumber: '',
      panUrl: '',
      address: '',
      city: '',
      state: '',
      country: '',
      pin: '',
      addressProofNumber: '',
      addressProofUrl: '',
      consultationChargesInINR: 0,
      isConsultant: false,
      doctorRegistrationNumber: 'NA',
      locationBasedFeeConfig: locationBasedFeeConfig,
      avaiability: ['NA'],
      activeFrom: 'NA',
      activeTill: 'NA',
      employeeId: 'NA',
      uniqueId: 'NA',
      organization: 'NA',
      superSpeciality: 'NA',
      userId: 'NA',
      password: 'NA',
      about: 'NA',
      feeDetails: {
        domesticPhysicalConsultationCharges: 0,
        domesticVideoConsultationCharges: 0,
        domesticFollowUpCharges: 0,
        internationalPhysicalConsultationCharges: 0,
        internationalVideoConsultationCharges: 0,
        internationalFollowUpCharges: 0,
      },
      organizationUID: "",
      specialityUID: ""
    });
    await employee.save();

    if (data.userType === UserType.PartnerSuperuser) {

      let partner = await PartnerSuperuser.findById(data.id)

      if (partner) {
        msg.ack();
        console.log("Return UserType.PartnerSuperuser")
        return;
      }

      // Create a candidate
      partner = PartnerSuperuser.build({
        id: data.id,
        userFirstName: data.userFirstName,
        userLastName: data.userLastName,
        emailId: data.emailId,
        phoneNumber: data.phoneNumber,
        partnerId: data.partnerId,
        partnerType: data.partnerType,
        userStatus: data.userStatus,
        accessLevel: data.accessLevel,
        userType: data.userType,
      });
      await partner.save();
      // Set user state
      //Update State
      const existingState = PartnerState.build({
        id: partner.partnerId,
        superuserId: partner.id!,
        partnerType: partner.partnerType,
        currentState: PartnerStates.PartnerVerifiedAndActive,
        partnerId: partner.partnerId,
      });
      await existingState.save();
    } else {
      console.log("ConsultantCreatedPublisher in partner event")
      new ConsultantCreatedPublisher(natsWrapper.client).publish({
        id: employee.id!,
        userFirstName: employee.userFirstName,
        userMiddleName: employee.userMiddleName,
        userLastName: employee.userLastName,
        emailId: employee.emailId,
        phoneNumber: employee.phoneNumber,
        partnerId: employee.partnerId,
        userStatus: employee.userStatus,
        userType: employee.userType,
        dateOfBirth: employee.dateOfBirth,
        experinceInYears: employee.experinceInYears,
        qualificationList: employee.qualificationList,
        department: employee.department,
        specialization: employee.specialization,
        profileImageName: employee.profileImageName,
        designation: employee.designation,
        city: employee.city,
        state: employee.state,
        country: employee.country,
        pin: employee.pin,
        languages: employee.languages,
        consultationChargesInINR: employee.consultationChargesInINR,
        genderType: employee.genderType,
        doctorRegistrationNumber: employee.doctorRegistrationNumber,
        locationBasedFeeConfig: locationBasedFeeConfig,
        about: employee.about
      });
    }
    // ack the message
    msg.ack();
  }
}
