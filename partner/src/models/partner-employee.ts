import mongoose from 'mongoose';
import { UserStatus, UserType, AccessLevel, DepartmentType, SpecializationType, GenderType, LocationBasedFeeConfig } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PartnerEmployeeAttrs {
  id: string;
  title: string;
  userFirstName: string;
  userMiddleName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  doctorRegistrationNumber: string;
  partnerId: string;
  userStatus: UserStatus;
  accessLevel: AccessLevel;
  genderType: GenderType;
  dateOfBirth: string;
  experinceInYears: number;
  qualificationList: [string];
  userType: UserType;
  department: DepartmentType;
  specialization: SpecializationType;
  profileImageName: string;
  designation: string;
  onboardingDate: Date;
  languages: [string];
  locationBasedFeeConfig: [LocationBasedFeeConfig];
  panNumber: string;
  panUrl: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  addressProofNumber: string;
  addressProofUrl: string;
  consultationChargesInINR: number;
  isConsultant: boolean;
  avaiability: [string],
  activeFrom: string,
  activeTill: string,
  employeeId: string,
  uniqueId: string,
  organization: string,
  superSpeciality: string,
  userId: string,
  password: string,
  about: string,
  feeDetails: {
    domesticPhysicalConsultationCharges: number,
    domesticVideoConsultationCharges: number,
    domesticFollowUpCharges: number,
    internationalPhysicalConsultationCharges: number,
    internationalVideoConsultationCharges: number,
    internationalFollowUpCharges: number,
  },
  organizationUID: string,
  specialityUID: string

}

export interface PartnerEmployeeDoc extends mongoose.Document {
  userFirstName: string;
  title: string;
  userMiddleName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  doctorRegistrationNumber: string;
  partnerId: string;
  userStatus: UserStatus;
  accessLevel: AccessLevel;
  dateOfBirth: string;
  experinceInYears: number;
  userType: UserType;
  department: DepartmentType;
  specialization: SpecializationType;
  qualificationList: [string];
  profileImageName: string;
  consultationChargesInINR: number;
  designation: string;
  onboardingDate: Date;
  version: number;
  genderType: GenderType;
  languages: [string];
  locationBasedFeeConfig: [LocationBasedFeeConfig];
  panNumber: string;
  panUrl: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  addressProofNumber: string;
  addressProofUrl: string;
  isConsultant: boolean;
  avaiability: [string];
  activeFrom: string;
  activeTill: string;
  employeeId: string;
  uniqueId: string;
  organization: string;
  superSpeciality: string;
  userId: string;
  password: string;
  about: string;
  feeDetails: {
    domesticPhysicalConsultationCharges: number,
    domesticVideoConsultationCharges: number,
    domesticFollowUpCharges: number,
    internationalPhysicalConsultationCharges: number,
    internationalVideoConsultationCharges: number,
    internationalFollowUpCharges: number,
  };
  organizationUID: string,
  specialityUID: string
}


interface PartnerEmployeeModel extends mongoose.Model<PartnerEmployeeDoc> {
  build(attrs: PartnerEmployeeAttrs): PartnerEmployeeDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PartnerEmployeeDoc | null>;
}

const partnerEmployeeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      default: ""
    },
    userFirstName: {
      type: String,
      required: true,
    },
    userLastName: {
      type: String,
      required: false,
      default: ""
    },
    userMiddleName: {
      type: String,
      required: false,
    },
    emailId: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    partnerId: {
      type: String,
      required: true,
    },
    userStatus: {
      type: UserStatus,
      required: true,
    },
    accessLevel: {
      type: AccessLevel,
      required: true,
    },
    userType: {
      type: UserType,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: false,
    },
    doctorRegistrationNumber: {
      type: String,
      required: false,
    },
    experinceInYears: {
      type: Number,
      required: true,
    },
    department: {
      type: DepartmentType,
      required: true,
    },
    specialization: {
      type: SpecializationType,
      required: false,
    },
    profileImageName: {
      type: String,
      required: false,
    },
    designation: {
      type: String,
      required: false,
    },
    qualificationList: {
      type: [String],
      required: false,
    },
    locationBasedFeeConfig: {
      type: [Object],
      required: false,
      default: null
    },
    onboardingDate: {
      type: Date,
      required: true,
    },
    genderType: {
      type: GenderType,
      required: false,
    },
    languages: {
      type: [String],
      required: false,
    },
    panNumber: {
      type: String,
      required: false,
    },
    panUrl: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    pin: {
      type: String,
      required: false,
    },
    addressProofNumber: {
      type: String,
      required: false,
    },
    addressProofUrl: {
      type: String,
      required: false,
    },
    consultationChargesInINR: {
      type: Number,
      required: false,
      default: 0
    },
    isConsultant: {
      type: Boolean,
      required: false,
    },
    avaiability: {
      type: [String]
    },
    activeFrom: {
      trpe: String
    },
    activeTill: {
      type: String
    },
    employeeId: {
      type: String
    },
    uniqueId: {
      type: String
    },
    organization: {
      type: String
    },
    superSpeciality: {
      type: String
    },
    userId: {
      type: String
    },
    password: {
      type: String
    },
    about: {
      type: String
    },
    feeDetails: {
      type: Object
    },
	organizationUID: {
		type: String
	},
	specialityUID: {
		type: String
	},
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
partnerEmployeeSchema.set('versionKey', 'version');
partnerEmployeeSchema.plugin(updateIfCurrentPlugin);

partnerEmployeeSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return PartnerEmployee.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
partnerEmployeeSchema.static('build', (attrs: PartnerEmployeeAttrs) => {
  return new PartnerEmployee({
    _id: attrs.id,
    userFirstName: attrs.userFirstName,
    userMiddleName: attrs.userMiddleName,
    userLastName: attrs.userLastName,
    emailId: attrs.emailId,
    phoneNumber: attrs.phoneNumber,
    partnerId: attrs.partnerId,
    userStatus: attrs.userStatus,
    accessLevel: attrs.accessLevel,
    userType: attrs.userType,
    dateOfBirth: attrs.dateOfBirth,
    experinceInYears: attrs.experinceInYears,
    department: attrs.department,
    specialization: attrs.specialization,
    profileImageName: attrs.profileImageName,
    designation: attrs.designation,
    qualificationList: attrs.qualificationList,
    onboardingDate: attrs.onboardingDate,
    genderType: attrs.genderType,
    languages: attrs.languages,
    panNumber: attrs.panNumber,
    panUrl: attrs.panUrl,
    address: attrs.address,
    city: attrs.city,
    state: attrs.state,
    country: attrs.country,
    pin: attrs.pin,
    locationBasedFeeConfig: attrs.locationBasedFeeConfig,
    addressProofNumber: attrs.addressProofNumber,
    addressProofUrl: attrs.addressProofUrl,
    consultationChargesInINR: attrs.consultationChargesInINR,
    isConsultant: attrs.isConsultant,
    doctorRegistrationNumber: attrs.doctorRegistrationNumber,
    title: attrs.title,
    avaiability: attrs.avaiability,
    activeFrom: attrs.activeFrom,
    activeTill: attrs.activeTill,
    employeeId: attrs.employeeId,
    uniqueId: attrs.uniqueId,
    organization: attrs.organization,
    superSpeciality: attrs.superSpeciality,
    userId: attrs.userId,
    password: attrs.password,
    about: attrs.about,
    feeDetails: attrs.feeDetails,
	organizationUID: attrs.organizationUID,
	specialityUID: attrs.specialityUID
  });
});

const PartnerEmployee = mongoose.model<PartnerEmployeeDoc, PartnerEmployeeModel>('PartnerEmployee', partnerEmployeeSchema);

export { PartnerEmployee };
