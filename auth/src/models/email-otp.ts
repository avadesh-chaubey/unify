import mongoose from 'mongoose';
import { OTPStatus } from '@unifycaredigital/aem'

// An interface that describes the properties
// that are requried to create a new User
interface emailOTPAttrs {
  emailId: string;
  otp: number;
  otpStatus: OTPStatus;
  serialNumber: number;
}

// An interface that describes the properties
// that a User Document has
interface emailOTPDoc extends mongoose.Document {
  emailId: string;
  otp: number;
  otpStatus: OTPStatus;
  serialNumber: number;
}

// An interface that describes the properties
// that a User Model has
interface EmailOTPModel extends mongoose.Model<emailOTPDoc> {
  build(attrs: emailOTPAttrs): emailOTPDoc;
}

const emailOTPSchema = new mongoose.Schema(
  {
    emailId: {
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
emailOTPSchema.static('build', (attrs: emailOTPAttrs) => {
  return new EmailOTP(attrs);
});

const EmailOTP = mongoose.model<emailOTPDoc, EmailOTPModel>('EmailOTP', emailOTPSchema);

export { EmailOTP };
