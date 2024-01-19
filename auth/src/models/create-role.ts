import mongoose from 'mongoose';

interface employeeRoleAttrs {
  role: string;
  isRoleEnabled: Boolean;
  createdBy: String;
  updatedBy: String;
  createdAt: Date;
  updatedAt: Date;
}

interface EmployeeRoleDoc extends mongoose.Document {
  role: string;
  isRoleEnabled: Boolean;
  createdBy: String;
  updatedBy: String;
  createdAt: Date;
  updatedAt: Date;
}

interface EmployeeRoleModel extends mongoose.Model<EmployeeRoleDoc> {
  build(attrs: employeeRoleAttrs): EmployeeRoleDoc;
  findByEvent(event: {
    id: string;
  }): Promise<EmployeeRoleDoc | null>;
}

const createRoleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true
  },
  isRoleEnabled: {
    type: Boolean,
    default: false
  },
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
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

createRoleSchema.static('build', (attrs: employeeRoleAttrs) => {
  return new EmployeeRoles({
    role: attrs.role,
    isRoleEnabled: attrs.isRoleEnabled,
    createdBy: attrs.createdBy,
    updatedBy: attrs.updatedBy,
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt
  });
});

const EmployeeRoles = mongoose.model<EmployeeRoleDoc, EmployeeRoleModel>('EmployeeRoles', createRoleSchema);

export { EmployeeRoles };
