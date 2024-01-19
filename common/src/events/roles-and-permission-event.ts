import { Subjects } from './subjects';

export interface RolesAndPermissionEvent {
  subject: Subjects.RolesAndPermission;
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
