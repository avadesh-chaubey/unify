import mongoose from 'mongoose';
import { UserStatus, UserType, AccessLevel, DepartmentType, SpecializationType } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface ConsultantAttrs {
  id: string;
  userFirstName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  partnerId: string;
  userStatus: UserStatus;
  dateOfBirth: string;
  experinceInYears: number;
  qualificationList: [string];
  userType: UserType;
  department: DepartmentType;
  specialization: SpecializationType;
  profileImageName: string;
  consultationChargesInINR: number;
  designation: string;
  displayProfileImageName: string;
  displayDesignation: string;
  displayQualification: string;
  displayAdditionalInformation: string;
  doctorRegistrationNumber: string;
  onboardingDate: Date;
}

interface ConsultantDoc extends mongoose.Document {
  userFirstName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  partnerId: string;
  userStatus: UserStatus;
  dateOfBirth: string;
  experinceInYears: number;
  qualificationList: [string];
  userType: UserType;
  department: DepartmentType;
  specialization: SpecializationType;
  profileImageName: string;
  consultationChargesInINR: number;
  designation: string;
  displayProfileImageName: string;
  displayDesignation: string;
  displayQualification: string;
  displayAdditionalInformation: string;
  doctorRegistrationNumber: string;
  onboardingDate: Date;
  version: number;
}


interface ConsultantModel extends mongoose.Model<ConsultantDoc> {
  build(attrs: ConsultantAttrs): ConsultantDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ConsultantDoc | null>;
}

const consultantSchema = new mongoose.Schema(
  {
    userFirstName: {
      type: String,
      required: true,
    },
    userLastName: {
      type: String,
      required: false,
      default: ""
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
    userType: {
      type: UserType,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: false,
      default: ""
    },
    experinceInYears: {
      type: Number,
      required: false,
      default: ""
    },
    consultationChargesInINR: {
      type: Number,
      required: false,
      default: 0
    },
    department: {
      type: DepartmentType,
      required: false,
      default: ""
    },
    specialization: {
      type: SpecializationType,
      required: false,
      default: ""
    },
    profileImageName: {
      type: String,
      required: false,
      default: ""
    },
    designation: {
      type: String,
      required: false,
      default: ""
    },
    displayProfileImageName: {
      type: String,
      required: false,
      default: ""
    },
    displayDesignation: {
      type: String,
      required: false,
      default: ""
    },
    displayQualification: {
      type: String,
      required: false,
      default: ""
    },
    displayAdditionalInformation: {
      type: String,
      required: false,
      default: ""
    },
    qualificationList: {
      type: [String],
      required: false,
      default: ""
    },
    onboardingDate: {
      type: Date,
      required: false,
      default: ""
    },
    doctorRegistrationNumber: {
      type: String,
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
consultantSchema.set('versionKey', 'version');
consultantSchema.plugin(updateIfCurrentPlugin);

consultantSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return Consultant.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
consultantSchema.static('build', (attrs: ConsultantAttrs) => {
  return new Consultant({
    _id: attrs.id,
    userFirstName: attrs.userFirstName,
    userLastName: attrs.userLastName,
    emailId: attrs.emailId,
    phoneNumber: attrs.phoneNumber,
    partnerId: attrs.partnerId,
    userStatus: attrs.userStatus,
    userType: attrs.userType,
    dateOfBirth: attrs.dateOfBirth,
    experinceInYears: attrs.experinceInYears,
    department: attrs.department,
    consultationChargesInINR: attrs.consultationChargesInINR,
    specialization: attrs.specialization,
    profileImageName: attrs.profileImageName,
    designation: attrs.designation,
    displayProfileImageName: attrs.displayProfileImageName,
    displayDesignation: attrs.displayDesignation,
    displayQualification: attrs.displayQualification,
    displayAdditionalInformation: attrs.displayAdditionalInformation,
    qualificationList: attrs.qualificationList,
    doctorRegistrationNumber: attrs.doctorRegistrationNumber,
    onboardingDate: attrs.onboardingDate
  });
});

const Consultant = mongoose.model<ConsultantDoc, ConsultantModel>('Consultant', consultantSchema);

export { Consultant };
