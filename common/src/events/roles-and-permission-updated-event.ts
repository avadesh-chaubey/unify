import { Subjects } from './subjects';

export interface RolesAndPermissionUpdatedEvent {
  subject: Subjects.RolesAndPermissionUpdated;
  data: {
	id :string;
    role: string;
	roleEditIds: [Number];
	roleViewIds: [Number];
	createdBy: String;
	updatedBy: String;
	createdAt: Date;
	updatedAt: Date;
  };
}
