import { Subjects } from './subjects';

export interface PartnerInformationCreatedEvent {
  subject: Subjects.PartnerInformationCreated;
  data: {
    id: string;
    partnerId: string;
    legalName: string;
    ownerOrganisationUID: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    status: boolean;
  }
}
