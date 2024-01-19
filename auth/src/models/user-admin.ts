import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { AccessLevel, UserType, UserStatus } from '@unifycaredigital/aem'

const SALT_FACTOR = 10;

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  id: string;
  userFirstName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  password: string;
  userType: UserType;
  partnerId: string;
  accessLevel: AccessLevel;
  lastAuthAt: Date;
  userStatus: UserStatus;
  registrationTimeAndDate: Date;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  userFirstName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  password: string;
  userType: UserType;
  partnerId: string;
  accessLevel: AccessLevel;
  lastAuthAt: Date;
  userStatus: UserStatus;
  registrationTimeAndDate: Date;
  role: string;
  roleAssignedDate: Date;
  roleAssignedBy: string;
  isRoleActive: boolean
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: {
    id: string;
  }): Promise<UserDoc | null>;
}

const userSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    password: {
      type: String,
    },
    userType: {
      type: String,
      required: true
    },
    partnerId: {
      type: String,
      required: true
    },
    accessLevel: {
      type: AccessLevel,
      required: true
    },
    lastAuthAt: {
      type: Date,
      required: true
    },
    registrationTimeAndDate: {
      type: Date,
      required: true
    },
    userStatus: {
      type: UserStatus,
      required: true
    },
    userFirstName: {
      type: String,
      required: true
    },
    userLastName: {
      type: String,
      required: false,
      default: ""
    },
    role: {
      type: String,
      required: false,
      default: ""
    },
    isRoleActive: {
      type: Boolean,
      default: false,
      required: true
    },
    roleAssignedBy: {
      type: String,
      required: false
    },
    roleAssignedDate: {
      type: Date,
      required: false
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      }
    }
  }
);

userSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  // @ts-ignore - TODO
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.get('password'), salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      // @ts-ignore - TODO
      user.set('password', hash);
      // @ts-ignore - TODO
      next();
    });
  });
});

// @ts-ignore - TODO
userSchema.static('findByEvent', (event: { id: string }) => {
  return UserAdmin.findOne({
    _id: event.id,
  });
});

// @ts-ignore - TODO
userSchema.static('build', (attrs: UserAttrs) => {
  return new UserAdmin({
    _id: attrs.id,
    userFirstName: attrs.userFirstName,
    userLastName: attrs.userLastName,
    emailId: attrs.emailId,
    phoneNumber: attrs.phoneNumber,
    password: attrs.password,
    userType: attrs.userType,
    partnerId: attrs.partnerId,
    accessLevel: attrs.accessLevel,
    lastAuthAt: attrs.lastAuthAt,
    userStatus: attrs.userStatus,
    registrationTimeAndDate: attrs.registrationTimeAndDate,

  });
});

const UserAdmin = mongoose.model<UserDoc, UserModel>('UserAdmin', userSchema, 'users');

export { UserAdmin };
