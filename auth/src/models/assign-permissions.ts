import mongoose from 'mongoose';


interface RolesAndPermissionsAttrs {
	id :string
	role: string;
	roleEditIds: [Number];
	roleViewIds: [Number];
	createdBy: String;
	updatedBy: String;
	createdAt: Date;
	updatedAt: Date;

}
interface RolesAndPermissionsDoc extends mongoose.Document {
	role: string;
	roleEditIds: [Number];
	roleViewIds: [Number];
	createdBy: String;
	updatedBy: String;
	createdAt: Date;
	updatedAt: Date;
}

interface RolesAndPermissionsModel extends mongoose.Model<RolesAndPermissionsDoc> {
  build(attrs: RolesAndPermissionsAttrs): RolesAndPermissionsDoc;
  findByEvent(event: {
    id: string;
  }): Promise<RolesAndPermissionsDoc | null>;
}

const rolesAndPermissionsSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  roleEditIds: [Number],
		roleViewIds: [Number],
		createdBy: {
			type: String
		},
		updatedBy: {
			type: String
		},
		createdAt: {
			type: Date
		},
		updatedAt: {
			type: Date
		}
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

rolesAndPermissionsSchema.static('build', (attrs: RolesAndPermissionsAttrs) => {
  return new RolesAndPermissions({
	_id: attrs.id,
	role: attrs.role,
	roleEditIds: attrs.roleEditIds,
	roleViewIds: attrs.roleViewIds,
	createdBy: attrs.createdBy,
	updatedBy: attrs.updatedBy,
	createdAt: attrs.createdAt,
	updatedAt: attrs.updatedAt,
  });
});

const RolesAndPermissions = mongoose.model<RolesAndPermissionsDoc, RolesAndPermissionsModel>('RolesAndPermissions', rolesAndPermissionsSchema);

export { RolesAndPermissions };
