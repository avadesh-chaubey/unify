import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { LabType } from '@unifycaredigital/aem'

interface Complaint {
  symptoms: string;
  since: string;
  sinceUnit: string;
  howOften: string;
  severity: string;
  details: string;
};

export interface Vitals {
  heigthInCms: number;
  weigthInKgs: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodPressure: string;
  tempratureInFernite: number;
  bloodSugarLevel: number;
  waistCircumference: string;
  pulse: string;
  heigthInCmsDate: Date;
  weigthInKgsDate: Date;
  bloodPressureSystolicDate: Date;
  bloodPressureDiastolicDate: Date;
  tempratureInFerniteDate: Date;
  waistCircumferenceDate: Date;
  pulseDate: Date;
  bmi: string;
  bmiDate: Date;

};

interface PatientMedicalHistory {
  medicalHistory: string;
  medicationHistory: string;
  surgicalHistory: string;
  drugAllergies: string;
  dietAllergiesOrRestrictions: string;
  personalLifestyle: string;
  personalHabits: string;
  environmentalAndOccupationalHistory: string;
  familyMedicalHistory: string;
  pagnencyDetails: string;

};

enum PatientDocumentType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  TEST_REPORT = 'report',
  MEDICINE_PRESCRIPTION = 'medicine:prescription',
  PAST_CONSULTATION = 'past:consultation',
  DIET_CHART = 'diet:chart',
  OTHER = 'other'
}

interface PatientDocument {
  documentName: string;
  documentURL: string;
  documentType: PatientDocumentType;
  documentDated: string;
  uploadDate: string;
  refferredByDiahome: boolean;
}

interface HealthRecords {
  patientPhotos: [PatientDocument];
  patientReports: [PatientDocument];
  pastConsultations: [PatientDocument];
};

interface Notes {
  juniorDoctorNotes: string;
  diagnosticTestResult: string;
  clinicalObservations: string;
  personalNotes: string;
};

export interface MedicinePrescription {
  nameOfTheDrug: string;
  medicineType: string;
  intakeFrequency: string;
  durationInDays: number;
  food: string;
  administrationRoute: string;
  otherNotes: string;
  numberOfUnits: number;
  enabled: boolean;
  packOf: string;
  MRP: number;
  gstInPercentage: number;
  hsnCode: string;
}

export interface TestPrescription {
  enabled: boolean;
  serviceType: string;
  cost: number;
  preCondition: string;
  reportWaitingTime: string;
  addCollectionCharges: boolean;
  lab: string;
  date: Date;
}

interface Refferral {
  consultSpecialty: string;
  reason: string;
}

interface CaseSheetAttrs {
  id: string;
  appointmentId: string;
  patientId: string;
  parentId: string;
  chiefComplaints: [Complaint];
  vitals: Vitals;
  medicalHistory: PatientMedicalHistory;
  healthRecords: HealthRecords;
  notes: Notes;
  diagnosis: [string];
  medicinePrescription: [MedicinePrescription];
  testPrescription: [TestPrescription]
  followUpChatDays: string;
  adviceInstruction: [string];
  refferral: Refferral;
  lab: LabType;
}


interface CaseSheetDoc extends mongoose.Document {
  appointmentId: string;
  patientId: string;
  parentId: string;
  chiefComplaints: [Complaint];
  vitals: Vitals;
  medicalHistory: PatientMedicalHistory;
  healthRecords: HealthRecords;
  notes: Notes;
  diagnosis: [string];
  medicinePrescription: [MedicinePrescription];
  testPrescription: [TestPrescription]
  followUpChatDays: string;
  adviceInstruction: [string];
  refferral: Refferral;
  version: number;
  lab: LabType;
}


interface CaseSheetModel extends mongoose.Model<CaseSheetDoc> {
  build(attrs: CaseSheetAttrs): CaseSheetDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<CaseSheetDoc | null>;
}

const caseSheetSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    chiefComplaints: {
      type: [Object],
      required: true,
    },
    vitals: {
      type: Object,
      required: true,
    },
    medicalHistory: {
      type: Object,
      required: true,
    },
    healthRecords: {
      type: Object,
      required: true,
    },
    notes: {
      type: Object,
      required: true,
    },
    diagnosis: {
      type: [String],
      required: true,
    },
    medicinePrescription: {
      type: [Object],
      required: true,
    },
    testPrescription: {
      type: [Object],
      required: true,
    },
    followUpChatDays: {
      type: String,
      required: true,
    },
    adviceInstruction: {
      type: [String],
      required: true,
    },
    refferral: {
      type: Object,
      required: true,
    },
    lab: {
      type: LabType,
      required: false,
      default: LabType.ARH
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
caseSheetSchema.set('versionKey', 'version');
caseSheetSchema.plugin(updateIfCurrentPlugin);

caseSheetSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return CaseSheet.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
caseSheetSchema.static('build', (attrs: CaseSheetAttrs) => {
  return new CaseSheet({
    _id: attrs.id,
    appointmentId: attrs.appointmentId,
    patientId: attrs.patientId,
    parentId: attrs.parentId,
    chiefComplaints: attrs.chiefComplaints,
    vitals: attrs.vitals,
    medicalHistory: attrs.medicalHistory,
    healthRecords: attrs.healthRecords,
    notes: attrs.notes,
    diagnosis: attrs.diagnosis,
    medicinePrescription: attrs.medicinePrescription,
    testPrescription: attrs.testPrescription,
    followUpChatDays: attrs.followUpChatDays,
    adviceInstruction: attrs.adviceInstruction,
    refferral: attrs.refferral,
    lab: attrs.lab
  });
});

const CaseSheet = mongoose.model<CaseSheetDoc, CaseSheetModel>('CaseSheet', caseSheetSchema);

export { CaseSheet };
