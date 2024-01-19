import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OTPExpiredEvent, OTPStatus, OTPType } from '@unifycaredigital/aem';
import { natsWrapper } from '../../../nats-wrapper';
import { OTPExpiredListener } from '../otp-expired-listener';
import { EmailOTP } from '../../../models/email-otp';
import { PhoneOTP } from '../../../models/phone-otp';

const setupEmailOTP = async () => {

  const id = new mongoose.Types.ObjectId().toHexString();
  const emailOtp = EmailOTP.build({
    emailId: 'test@test.com',
    otp: 6666,
    otpStatus: OTPStatus.Valid,
    serialNumber: 1,
  });

  // Save the otp to the database
  await emailOtp.save();

  const listener = new OTPExpiredListener(natsWrapper.client);

  const data: OTPExpiredEvent['data'] = {
    id: emailOtp.emailId,
    otpType: OTPType.Email,
    serialNumber: 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, listener };
};

const setupPhoneOTP = async () => {

  const id = new mongoose.Types.ObjectId().toHexString();
  const phoneOtp = PhoneOTP.build({
    phoneNumber: '9999999999',
    otp: 5555,
    otpStatus: OTPStatus.Valid,
    serialNumber: 1,
    token: 'NA'
  });

  // Save the otp to the database
  await phoneOtp.save();

  const listener = new OTPExpiredListener(natsWrapper.client);

  const data: OTPExpiredEvent['data'] = {
    id: phoneOtp.phoneNumber,
    otpType: OTPType.Phone,
    serialNumber: 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, listener };
};

it('receive and update a Email OTP', async () => {

  const { msg, data, listener } = await setupEmailOTP();

  await listener.onMessage(data, msg);

  const emailOtp = await EmailOTP.findOne({ emailId: data.id });

  expect(emailOtp).toBeDefined();
  expect(emailOtp!.otpStatus).toEqual(OTPStatus.Expired);
});

it('acks the message of EmailOTP', async () => {
  const { msg, data, listener } = await setupEmailOTP();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('receive and update a Phone OTP', async () => {

  const { msg, data, listener } = await setupPhoneOTP();

  await listener.onMessage(data, msg);

  const phoneOtp = await PhoneOTP.findOne({ phoneNumber: data.id });

  expect(phoneOtp).toBeDefined();
  expect(phoneOtp!.otpStatus).toEqual(OTPStatus.Expired);
});

it('acks the message of PhoneOTP', async () => {
  const { msg, data, listener } = await setupPhoneOTP();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

