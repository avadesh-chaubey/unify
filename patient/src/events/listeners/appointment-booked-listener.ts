import { appointmentBookedGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, AppointmentBookedEvent, Subjects, ChatGroupActionType, OrderStatus, OrderType, SMSType, SMSTemplate, EmailType, EmailTemplate, EmailDeliveryType, ConsultationType, UserType, } from '@unifycaredigital/aem';
import { Appointment } from '../../models/appointment-order';
import { Patient } from '../../models/patient';
import { Consultant } from '../../models/consultant';
import { natsWrapper } from '../../nats-wrapper';
import { UpdateAppointmentChatGroupPublisher } from '../publishers/update-appointment-chat-group-publisher';
import moment from 'moment';
import { OrderHistory } from '../../models/order-history';
import mongoose from 'mongoose';
import { SendNewSMSPublisher } from '../publishers/send-new-sms-publisher';
import { SendNewEmailPublisher } from '../publishers/send-new-email-publisher';


const FORTY_FIVE_MIN = 45;
const FIFTEEN_MIN = 15;
const TWENTY_THREE_HOUR = 23;
const REMINDER_WINDOW_SECONDS = 900;

const MIN_UID_NUMBER = 100000;
const MAX_UID_NUMBER = 999999;


export class AppointmentBookedListener extends Listener<AppointmentBookedEvent> {
  subject: Subjects.AppointmentBooked = Subjects.AppointmentBooked;
  queueGroupName = appointmentBookedGroupName;

  async onMessage(data: AppointmentBookedEvent['data'], msg: Message) {

    let appointment = null;
    if (data.appointmentId) {
      appointment = await Appointment.findById(data.appointmentId);
      if (appointment) {
        console.log("appointment found for Id: " + appointment.id)
        msg.ack();
        return;
      }
    } else {
      msg.ack();
      return;
    }

    let patient = await Patient.findById(data.customerId);
    if (!patient) {
      console.log("Patient not found for Id: " + data.customerId)
      msg.ack();
      return;
    }
    if (data.orderType == OrderType.PaidAppointment && data.consultationType === ConsultationType.Doctor) {
      patient.set({
        upcomingAppointmentDate: data.appointmentDate,
        freeDieticianConsultations: patient.freeDieticianConsultations + 1,
        freeEducatorConsultations: patient.freeEducatorConsultations + 1
      });
      await patient.save();
    } else if (data.orderType === OrderType.FreeAppointment && data.consultationType === ConsultationType.Dietician) {
      patient.set({
        upcomingAppointmentDate: data.appointmentDate,
        freeDieticianConsultations: patient.freeDieticianConsultations - 1,
      });
      await patient.save();
    } else if (data.orderType === OrderType.FreeAppointment && data.consultationType === ConsultationType.Educator) {
      patient.set({
        upcomingAppointmentDate: data.appointmentDate,
        freeEducatorConsultations: patient.freeEducatorConsultations - 1
      });
      await patient.save();
    } else {
      patient.set({
        upcomingAppointmentDate: data.appointmentDate,
      });
      await patient.save();
    }
    let ccmails = "";
    let consultant = await Consultant.findById(data.consultantId)

    let consultantName = 'NA';
    let consultantExperince = 0;
    let consultantProfileImageName = 'NA';
    let consultantDesignation = 'NA';
    let consultantQualification = 'NA';
    let consultantEmailId = 'NA';
    let docotrType = "Doctor";

    if (consultant) {
      consultantName = consultant.userFirstName + " " + consultant.userLastName;
      consultantExperince = consultant.experinceInYears;
      consultantProfileImageName = consultant.displayProfileImageName;
      consultantDesignation = String(consultant.userType);
      consultantQualification = String(consultant.qualificationList);
      consultantEmailId = consultant.emailId;
      ccmails = consultantEmailId;
      if (consultant.userType == UserType.Dietician) {
        docotrType = "Dietitian";
      } else if (consultant.userType == UserType.Educator) {
        docotrType = "Diabetes Educator";
      } else if (consultant.userType == UserType.Nutritionist) {
        docotrType = "Nutritionist";
      } else if (consultant.userType == UserType.PartnerRosterManager) {
        docotrType = "Roaster Manager";
      } else if (consultant.userType == UserType.Diabetologist) {
        docotrType = "Diabetologist";
      }
      else if (consultant.userType == UserType.Doctor) {
        docotrType = "Doctor";
      } else if (consultant.userType == UserType.PhysicianAssistant) {
        docotrType = "Physician Assistant";
      }
    }
    let assistantName = 'NA';
    let assistantProfileImageName = 'NA';
    let assistantEmailId = 'NA';
    if (data.assistantId !== 'NA') {
      let assistant = await Consultant.findById(data.assistantId)
      if (assistant) {
        assistantName = assistant.userFirstName + " " + assistant.userLastName;
        assistantProfileImageName = assistant.displayProfileImageName;
        assistantEmailId = assistant.emailId;
        //ccmails = ccmails + "," + assistantEmailId
      }
    }


    appointment = Appointment.build({
      id: data.appointmentId,
      consultantId: data.consultantId,
      customerId: data.customerId,
      creatorId: data.creatorId,
      partnerId: data.partnerId,
      parentId: data.parentId,
      createdBy: data.createdBy,
      basePriceInINR: data.basePriceInINR,
      consultationType: data.consultationType,
      appointmentDate: data.appointmentDate,
      appointmentSlotId: data.appointmentSlotId,
      appointmentStatus: data.appointmentStatus,
      appointmentCreationTime: data.appointmentCreationTime,
      consultantName: consultantName,
      consultantExperince: consultantExperince,
      consultantProfileImageName: consultantProfileImageName,
      consultantDesignation: consultantDesignation,
      consultantQualification: consultantQualification,
      customerDateOfBirth: patient.dateOfBirth,
      customerGender: patient.gender,
      customerName: patient.userFirstName,
      customerFirstName: patient.userFirstName,
      customerLastName: patient.userLastName,
      customerProfileImageName: patient.profileImageName,
      customerRelationship: patient.relationship,
      appointmentSummary: 'NA',
      orderType: data.orderType,
      orderStatus: data.orderStatus,
      assistantId: data.assistantId,
      assistantAppointmentDate: data.assistantAppointmentDate,
      assistantAppointmentSlotId: data.assistantAppointmentSlotId,
      assistantConsecutiveBookedSlots: data.assistantConsecutiveBookedSlots,
      appointmentRescheduleEnabled: data.appointmentRescheduleEnabled,
      appointmentPaymentStatus: data.appointmentPaymentStatus,
      arhOrderId: data.arhOrderId,
      paymentMode: data.paymentMode,
      parentName: patient.parentName,
      parentPhoneNumber: patient.phoneNumber,
      assistantNotRequired: data.assistantNotRequired,
      assistantName: assistantName,
      assistantProfileImageName: assistantProfileImageName,
      agoraVideoCallStartUID: Math.floor(Math.random() * (MAX_UID_NUMBER - MIN_UID_NUMBER)) + MIN_UID_NUMBER,
      appointmentType: data.appointmentType,
    })
    await appointment.save();

    const year = Number(moment(appointment.appointmentDate).format('YYYY'));
    // 0 is Jan , 11 is Dec when use in Date, where as for moment 1 is Jan, 12 is Dec
    const month = Number(moment(appointment.appointmentDate).format('MM')) - 1;
    const day = Number(moment(appointment.appointmentDate).format('DD'));

    let hour = Math.trunc(appointment.appointmentSlotId / 4);

    let minutes = ((appointment.appointmentSlotId % 4) * 15);

    let date = new Date(year, month, day, hour, minutes, 0, 0);

    date.setSeconds(date.getSeconds() - REMINDER_WINDOW_SECONDS);

    console.log('Reminder Time: ' + date + " for Appointment at: " + appointment.appointmentDate + " " + hour + ":" + minutes);

    const currentTime = String(moment().utcOffset(330).format('ddd DD-MMM-YYYY, hh:mm A'));
    let remarks = '';
    if (appointment.consultationType === ConsultationType.Diabetologist) {
      remarks = `Appointment booked with ${appointment.consultantName} \n(Physician Assistant :${appointment.assistantName}) ${currentTime}`;
    } else {
      remarks = `Appointment booked with ${appointment.consultantName} \n${currentTime}`;
    }
    ///// Publish Update Appointment Chat Group Message //////////////
    new UpdateAppointmentChatGroupPublisher(natsWrapper.client).publish({
      appointmentId: appointment.id!,
      patientId: appointment.customerId,
      consultantId: appointment.consultantId,
      appointmentDate: appointment.appointmentDate,
      assistantId: appointment.assistantId,
      appointmentSlotId: appointment.appointmentSlotId,
      remarks: remarks,
      chatGroupAction: ChatGroupActionType.ADDCHATGROUP,
      updateChatGroupAtTime: date,
      parentId: appointment.parentId,
      patientName: appointment.parentName,
      consultantName: appointment.consultantName,
      assistantName: appointment.assistantName,
      parentName: appointment.parentName,
      parentEmailId: patient.emailId,
      consultantEmailId: consultantEmailId,
      assistantEmailId: assistantEmailId,
    });

    let orderHistory = await OrderHistory.findById(appointment.id);
    if (!orderHistory) {
      orderHistory = OrderHistory.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        patientId: appointment.customerId,
        parentId: appointment.parentId,
        priceInINR: appointment.basePriceInINR,
        arhOrderid: appointment.arhOrderId,
        orderType: appointment.orderType,
        orderDate: new Date(),
        orderId: appointment.id!,
        orderPaymentStatus: OrderStatus.Paid,
        paymentMode: appointment.paymentMode
      });
      await orderHistory.save();
    }

    const makeInitialCapital = (str: any) => {
      let word = str.toLowerCase().split(" ");
      for (let i = 0; i < word.length; i++) {
        word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
      }
      return word.join(" ");
    };

    //////// Send SMS to  patient about booking details 
    {
      let time = Math.floor(appointment.appointmentSlotId / 4);
      let suffix = "AM";
      if (time >= 12) {
        suffix = "PM";
      }
      if (time > 12) {
        time = time - 12;
      }
      let minutesStr = "";
      if (minutes < 10) {
        minutesStr = minutesStr.concat(minutes.toString(), "0");
      } else {
        minutesStr = minutes.toString();
      }
      const timeStr = time + ":" + minutesStr + " " + suffix;
      const date = appointment.appointmentDate.split("-")[2] + "-" + appointment.appointmentDate.split("-")[1] + "-" + appointment.appointmentDate.split("-")[0];
      const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
        "&To=" + patient.phoneNumber +
        "&TemplateName=" + SMSTemplate.BOOKING_DETAILS +
        "&VAR1=" + appointment.customerFirstName + " " + appointment.customerLastName +
        "&VAR2=" + appointment.consultantName + " on " + date + " at " + timeStr + ".";

      new SendNewSMSPublisher(natsWrapper.client).publish({
        to: patient.phoneNumber,
        body: smsBody,
        smsType: SMSType.Transactional,
        smsTemplate: SMSTemplate.BOOKING_DETAILS,
        generatedAt: new Date(),
      });
      const emailBody = {
        patientFirstName: makeInitialCapital(appointment.customerFirstName),
        patientLastName: makeInitialCapital(appointment.customerLastName),
        doctorName: appointment.consultantName,
        doctorQualification: consultantQualification,
        docotrType: docotrType,
        appointmentDate: date,
        appointmentTime: timeStr,
        feePaid: appointment.basePriceInINR
      }

      const objJson = JSON.stringify(emailBody);
      ccmails = ccmails + "," + String(process.env.SYSTEM_RECEIVER_EMAIL_ID);
      console.log('bccmails: ' + ccmails);

      //////// Send Email to  Patient 
      new SendNewEmailPublisher(natsWrapper.client).publish({
        to: patient.emailId,
        cc: assistantEmailId,
        bcc: ccmails,
        from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
        subject: 'Your Appointment has been Confirmed',
        body: objJson,
        emailType: EmailType.HtmlText,
        emailTemplate: EmailTemplate.AppointmentConfirmed,
        emaiDeliveryType: EmailDeliveryType.Immediate,
        atExactTime: new Date()
      });
    }
    msg.ack();
  }
}
