import { PrescriptionType } from '../types/prescription-type';
import { Subjects } from './subjects';

export interface PrescriptionCreatedEvent {
  subject: Subjects.PrescriptionCreated;
  data: {
    id: string;
    appointmentId: string;
    prescriptionType: PrescriptionType;
    patientId: string;
    consultantId: string;
    previousPrescriptionId: string;
    nextPrescriptionId: string;
    prescriptionDate: string;
    followupConsultationDate: string;
    diagnosticTestList: [string];
    medicinePrescriptionList: [string];
    consultantRemarksList: [string];
  };
}
