import { Subjects } from './subjects';

export interface PartnerInformationUpdatedEvent {
  subject: Subjects.PartnerInformationUpdated;
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
