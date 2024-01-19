import mongoose from 'mongoose';
import { GenderType, RelationshipType } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PatientAttrs {
  id: string;
  patientUID: string;
  userFirstName: string;
  userMiddleName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  phoneNumber2: string;
  partnerId: string;
  ownerOrganisationUID: string;
  dateOfBirth: string;
  gender: GenderType;
  profileImageName: string;
  parentId: string;
  parentName: string;
  motherName: string;
  relationship: RelationshipType;
  upcomingAppointmentDate: string;
  followupConsultationDate: string;
  mhrId: string;
  languages: [string];
  address: string;
  address2: string;
  area: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  freeDieticianConsultations: number;
  freeEducatorConsultations: number;
  freeDiabetologistConsultations: number;
  patientPASID: string;
  isVIP: boolean;
  nationality: string;
  statusFlag: string;
  branchName: string;
}

interface PatientDoc extends mongoose.Document {
  patientUID: string;
  userFirstName: string;
  userMiddleName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  phoneNumber2: string;
  partnerId: string;
  ownerOrganisationUID: string;
  dateOfBirth: string;
  gender: GenderType;
  profileImageName: string;
  parentId: string;
  parentName: string;
  motherName: string;
  relationship: RelationshipType;
  upcomingAppointmentDate: string;
  followupConsultationDate: string;
  mhrId: string;
  version: number;
  languages: [string];
  address: string;
  address2: string;
  area: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  freeDieticianConsultations: number;
  freeEducatorConsultations: number;
  freeDiabetologistConsultations: number;
  patientPASID: string;
  isVIP: boolean;
  nationality: string;
  statusFlag: string;
  branchName: string;
}


interface PatientModel extends mongoose.Model<PatientDoc> {
  build(attrs: PatientAttrs): PatientDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PatientDoc | null>;
}

const patientSchema = new mongoose.Schema(
  {
    patientUID: {
      type: String,
      requried: true
    },
    userFirstName: {
      type: String,
      required: true,
    },
    userMiddleName: {
      type: String,
      required: false,
      default: ""
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
    phoneNumber2: {
      type: String,
      required: false
    },
    partnerId: {
      type: String,
      required: true,
    },
    ownerOrganisationUID: {
      type: String,
      required: false,
      default: ''
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    gender: {
      type: GenderType,
      required: true,
    },
    profileImageName: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    relationship: {
      type: RelationshipType,
      required: true,
    },
    upcomingAppointmentDate: {
      type: String,
    },
    followupConsultationDate: {
      type: String,
    },
    mhrId: {
      type: String,
    },
    languages: {
      type: [String],
    },
    address: {
      type: String,
    },
    address2: {
      type: String,
      required: false,
      default: ''
    },
    area: {
      type: String,
      requried: false
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String
    },
    pin: {
      type: String,
    },
    parentName: {
      type: String,
      default: ''
    },
    motherName: {
      type: String,
      requried: true
    },
    freeDieticianConsultations: {
      type: Number,
      default: 0
    },
    freeEducatorConsultations: {
      type: Number,
      default: 0
    },
    freeDiabetologistConsultations: {
      type: Number,
      default: 0
    },
    patientPASID: {
      type: String,
      required: true
    },
    isVIP: {
      type: Boolean,
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    statusFlag: {
      type: String,
      required: false
    },
    branchName: {
      type: String,
      required: false
    }
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
patientSchema.set('versionKey', 'version');
patientSchema.plugin(updateIfCurrentPlugin);

patientSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return Patient.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
patientSchema.static('build', (attrs: PatientAttrs) => {
  return new Patient({
    _id: attrs.id,
    patientUID: attrs.patientUID,
    userFirstName: attrs.userFirstName,
    userMiddleName: attrs.userMiddleName,
    userLastName: attrs.userLastName,
    emailId: attrs.emailId,
    phoneNumber: attrs.phoneNumber,
    phoneNumber2: attrs.phoneNumber2,
    partnerId: attrs.partnerId,
    ownerOrganisationUID: attrs.ownerOrganisationUID,
    dateOfBirth: attrs.dateOfBirth,
    profileImageName: attrs.profileImageName,
    gender: attrs.gender,
    parentId: attrs.parentId,
    relationship: attrs.relationship,
    upcomingAppointmentDate: attrs.upcomingAppointmentDate,
    followupConsultationDate: attrs.followupConsultationDate,
    mhrId: attrs.mhrId,
    languages: attrs.languages,
    address: attrs.address,
    address2: attrs.address2,
    area: attrs.area,
    city: attrs.city,
    state: attrs.state,
    country: attrs.country,
    pin: attrs.pin,
    freeDieticianConsultations: attrs.freeDieticianConsultations,
    freeEducatorConsultations: attrs.freeEducatorConsultations,
    freeDiabetologistConsultations: attrs.freeDiabetologistConsultations,
    parentName: attrs.parentName,
    motherName: attrs.motherName,
    patientPASID: attrs.patientPASID,
    isVIP: attrs.isVIP,
    nationality: attrs.nationality,
    statusFlag: attrs.statusFlag,
    branchName: attrs.branchName,
  });
});

const Patient = mongoose.model<PatientDoc, PatientModel>('Patient', patientSchema);

export { Patient };
