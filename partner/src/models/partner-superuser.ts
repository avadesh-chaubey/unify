import mongoose from 'mongoose';
import { UserStatus, UserType, AccessLevel, PartnerType } from '@unifycaredigital/aem';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface PartnerSuperuserAttrs {
  id: string;
  userFirstName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  partnerId: string;
  userStatus: UserStatus;
  accessLevel: AccessLevel;
  partnerType: PartnerType;
  userType: UserType;
}

interface PartnerSuperuserDoc extends mongoose.Document {
  userFirstName: string;
  userLastName: string;
  emailId: string;
  phoneNumber: string;
  partnerId: string;
  userStatus: UserStatus;
  accessLevel: AccessLevel;
  partnerType: PartnerType;
  userType: UserType;
  version: number;
}


interface PartnerSuperuserModel extends mongoose.Model<PartnerSuperuserDoc> {
  build(attrs: PartnerSuperuserAttrs): PartnerSuperuserDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<PartnerSuperuserDoc | null>;
}

const partnerSubuserSchema = new mongoose.Schema(
  {
    userFirstName: {
      type: String,
      required: true,
    },
    userLastName: {
      type: String,
      required: false,
      default: ""
    },
    emailId: {
      type: String,
      required: true,
    },
    phoneNumber: {
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
    accessLevel: {
      type: AccessLevel,
      required: true,
    },
    partnerType: {
      type: PartnerType,
      required: true,
    },
    userType: {
      type: UserType,
      required: true,
    }
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
partnerSubuserSchema.set('versionKey', 'version');
partnerSubuserSchema.plugin(updateIfCurrentPlugin);

partnerSubuserSchema.static('findByEvent', (event: { id: string, version: number }) => {
  return PartnerSuperuser.findOne({
    _id: event.id,
    version: event.version - 1,
  });
});
partnerSubuserSchema.static('build', (attrs: PartnerSuperuserAttrs) => {
  return new PartnerSuperuser({
    _id: attrs.id,
    userFirstName: attrs.userFirstName,
    userLastName: attrs.userLastName,
    emailId: attrs.emailId,
    phoneNumber: attrs.phoneNumber,
    partnerId: attrs.partnerId,
    userStatus: attrs.userStatus,
    accessLevel: attrs.accessLevel,
    partnerType: attrs.partnerType,
    userType: attrs.userType,
  });
});

const PartnerSuperuser = mongoose.model<PartnerSuperuserDoc, PartnerSuperuserModel>('PartnerSuperuser', partnerSubuserSchema);

export { PartnerSuperuser };
