import mongoose from 'mongoose';
import { UserStatus, UserType, LocationBasedFeeConfig, SpecializationType } from '@unifycaredigital/aem';

interface ConsultantAttrs {
  id: string;
  userFirstName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  userStatus: UserStatus;
  userType: UserType;
  partnerId: string;
  locationBasedFeeConfig: [LocationBasedFeeConfig];
  consultationChargesInINR: number;
  about: string;
  qualificationList: [string];
  specialization: SpecializationType;
  profileImageName: string;
  experinceInYears: number;
}

interface ConsultantDoc extends mongoose.Document {
  userFirstName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  userStatus: UserStatus;
  userType: UserType;
  partnerId: string;
  consultationChargesInINR: number;
  locationBasedFeeConfig: [LocationBasedFeeConfig];
  about: string;
  qualificationList: [string];
  specialization: SpecializationType;
  profileImageName: string;
  experinceInYears: number;
}

interface ConsultantModel extends mongoose.Model<ConsultantDoc> {
  build(attrs: ConsultantAttrs): ConsultantDoc;
  findByEvent(event: {
    id: string;
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
    userStatus: {
      type: UserStatus,
      required: true,
    },
    userType: {
      type: UserType,
      required: true,
    },
    partnerId: {
      type: String,
      required: true,
    },
    consultationChargesInINR: {
      type: Number,
      required: false,
      default: 0
    },
    locationBasedFeeConfig: {
      type: [Object],
      required: false,
      default: 0
    },
    about: {
      type: String,
      required: true,
    },
    qualificationList: {
      type: [String],
      required: false,
    },
    profileImageName: {
      type: String,
      required: true,
    },
    experinceInYears: {
      type: Number,
      required: true,
    },
	specialization: {
		type: SpecializationType,
		required: false,
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

consultantSchema.static('findByEvent', (event: { id: string }) => {
  return Consultant.findOne({
    _id: event.id,
  });
});
consultantSchema.static('build', (attrs: ConsultantAttrs) => {
  return new Consultant({
    _id: attrs.id,
    userFirstName: attrs.userFirstName,
    userLastName: attrs.userLastName,
    emailId: attrs.emailId,
    phoneNumber: attrs.phoneNumber,
    userStatus: attrs.userStatus,
    userType: attrs.userType,
    partnerId: attrs.partnerId,
    consultationChargesInINR: attrs.consultationChargesInINR,
    locationBasedFeeConfig: attrs.locationBasedFeeConfig,
    about: attrs.about,
    qualificationList: attrs.qualificationList,
    specialization: attrs.specialization,
    profileImageName: attrs.profileImageName,
    experinceInYears: attrs.experinceInYears
  });
});

const Consultant = mongoose.model<ConsultantDoc, ConsultantModel>('Consultant', consultantSchema);

export { Consultant };
