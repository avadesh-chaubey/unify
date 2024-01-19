import mongoose from 'mongoose';
import { OTPStatus } from '@unifycaredigital/aem'

// An interface that describes the properties
// that are requried to create a new User
interface phoneOTPAttrs {
  phoneNumber: string;
  otp: number;
  otpStatus: OTPStatus;
  serialNumber: number;
  token: string;
}

// An interface that describes the properties
// that a User Document has
interface phoneOTPDoc extends mongoose.Document {
  phoneNumber: string;
  otp: number;
  otpStatus: OTPStatus;
  serialNumber: number;
  token: string;
}

// An interface that describes the properties
// that a User Model has
interface PhoneOTPModel extends mongoose.Model<phoneOTPDoc> {
  build(attrs: phoneOTPAttrs): phoneOTPDoc;
}

const phoneOTPSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true
    },
    otp: {
      type: Number,
      required: true
    },
    otpStatus: {
      type: OTPStatus,
      required: true
    },
    serialNumber: {
      type: Number,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);
// @ts-ignore - TODO
phoneOTPSchema.static('build', (attrs: phoneOTPAttrs) => {
  return new PhoneOTP(attrs);
});

const PhoneOTP = mongoose.model<phoneOTPDoc, PhoneOTPModel>('PhoneOTP', phoneOTPSchema);

export { PhoneOTP };
