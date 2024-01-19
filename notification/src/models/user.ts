import mongoose from 'mongoose';
import { UserStatus, UserType, AccessLevel, DepartmentType, SpecializationType, GenderType } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface UserAttrs {
  id: string;
  userName: string;
  emailId: string;
  phoneNumber: string;
  parentId: string;
  partnerId: string;
  userStatus: UserStatus;
  userType: UserType;
  onboardingDate: Date;
}

interface UserDoc extends mongoose.Document {
  userName: string;
  emailId: string;
  phoneNumber: string;
  parentId: string;
  partnerId: string;
  userStatus: UserStatus;
  userType: UserType;
  onboardingDate: Date;
}


interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<UserDoc | null>;
}

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    partnerId: {
      type: String,
      required: true,
    },
    userStatus: {
      type: UserStatus,
      required: true,
    },
    userType: {
      type: UserType,
      required: true,
    },
    onboardingDate: {
      type: Date,
      required: true,
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
userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return User.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
userSchema.static('build', (attrs: UserAttrs) => {
  return new User({
    _id: attrs.id,
    userName: attrs.userName,
    parentId: attrs.parentId,
    emailId: attrs.emailId,
    phoneNumber: attrs.phoneNumber,
    partnerId: attrs.partnerId,
    userStatus: attrs.userStatus,
    userType: attrs.userType,
    onboardingDate: attrs.onboardingDate,
  });
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
