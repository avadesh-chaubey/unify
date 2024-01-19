import { Subjects } from './subjects';
import { GenderType } from '../types/gender-type'
import { RelationshipType } from '../types/relationship-type';

export interface FamilyMemberCreatedEvent {
  subject: Subjects.FamilyMemberCreated;
  data: {
    id: string;
    userFirstName: string;
    userLastName: string;
    emailId: string;
    phoneNumber: string;
    partnerId: string;
    parentId: string;
    dateOfBirth: string,
    gender: GenderType,
    languages: [string];
    address: string;
    city: string;
    state: string;
    pin: string;
    relationship: RelationshipType;
  };
}
