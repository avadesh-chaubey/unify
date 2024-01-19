import { appointmentReminderGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, Subjects, ChatGroupActionType, OrderStatus, OrderType, SMSType, SMSTemplate, EmailType, EmailTemplate, EmailDeliveryType, UserType, AppointmentReminderEvent } from '@unifycaredigital/aem';
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

const APPOIINTMENT_SLICE_DURATION_IN_MIN = 15;
const NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR = 60 / APPOIINTMENT_SLICE_DURATION_IN_MIN;

export class AppointmentReminderListener extends Listener<AppointmentReminderEvent> {
  subject: Subjects.AppointmentReminder = Subjects.AppointmentReminder;
  queueGroupName = appointmentReminderGroupName;

  async onMessage(data: AppointmentReminderEvent['data'], msg: Message) {

    let appointment = await Appointment.findById(data.appointmentId);
    if (!appointment) {
      console.log("appointment not found for Id: ")
      msg.ack();
      return;
    }


    let patient = await Patient.findById(appointment.customerId);
    if (!patient) {
      console.log("Patient not found for Id: " + appointment.customerId)
      msg.ack();
      return;
    }

    let consultant = await Consultant.findById(appointment.consultantId)
    if (!consultant) {
      console.log("consultant not found for Id: " + appointment.customerId)
      msg.ack();
      return;
    }
    let consultantName = 'NA';
    let consultantExperince = 0;
    let consultantProfileImageName = 'NA';
    let consultantDesignation = 'NA';
    let consultantQualification = 'NA';

    if (consultant) {
      consultantName = consultant.userFirstName + " " + consultant.userLastName;
      consultantExperince = consultant.experinceInYears;
      consultantProfileImageName = consultant.displayProfileImageName;
      consultantDesignation = consultant.displayDesignation;
      consultantQualification = consultant.displayQualification;
    }


    let time = Math.floor(appointment.appointmentSlotId / 4);
    let suffix = "AM";
    if (time >= 12) {
      suffix = "PM";
    }
    if (time > 12) {
      time = time - 12;
    }
    let minutes = ((appointment.appointmentSlotId % 4) * 15);
    let minutesStr = "";
    if (minutes < 10) {
      minutesStr = minutesStr.concat(minutes.toString(), "0");
    } else {
      minutesStr = minutes.toString();
    }
    const timeStr = time + ":" + minutesStr + " " + suffix;
    // console.log("appointment Reminder timeStr: " + timeStr);
    // console.log("appointment Reminder appointment.appointmentDate: " + appointment.appointmentDate);
    const date = appointment.appointmentDate.split("-")[2] + "-" + appointment.appointmentDate.split("-")[1] + "-" + appointment.appointmentDate.split("-")[0];

    // var appointmentDate: any = new Date(date.concat(date,timeStr)); // 9:00 AM
    // var now: any = new Date(); // 5:00 PM

    // var timeDiffInMilli = appointmentDate - now;
    // var timeDiffInMin = Math.floor(timeDiffInMilli / 1000 / 60);
    const appointmentStartTime = appointment.appointmentDate
            + " "
            + String(Math.floor(appointment.appointmentSlotId / NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR))
            + ":"
            + String((appointment.appointmentSlotId % NUMBER_OF_APPOINTMENT_SLOTS_IN_AN_HOUR) * APPOIINTMENT_SLICE_DURATION_IN_MIN);
    let timeDiffInMin = moment(appointmentStartTime, 'YYYY-MM-DD HH:mm').diff(moment(), 'minutes') - 330;
    console.log("appointment Reminder timeDiffInMin: " + timeDiffInMin);
    if (timeDiffInMin > 20) {
      console.log("appointment date has rescheduled Id: " + appointment.id + " name: " + appointment.customerName)
      msg.ack();
      return;
    }
    let docotrType = "Doctor";
    if (consultant?.userType == UserType.Dietician) {
      docotrType = "Dietitian";
    } else if (consultant?.userType == UserType.Educator) {
      docotrType = "Diabetes Educator";
    } else if (consultant?.userType == UserType.Nutritionist) {
      docotrType = "Nutritionist";
    }
    const makeInitialCapital = (str: any) => {
      let word = str.toLowerCase().split(" ");
      for (let i = 0; i < word.length; i++) {
        word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
      }
      return word.join(" ");
    };
    //////// Send SMS to  patient about booking reminder 
    {

      const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
        "&To=" + patient.phoneNumber +
        "&TemplateName=" + SMSTemplate.PATIENT_APPOINTMENT_REMINDER +
        "&VAR1=" + appointment.customerName +
        "&VAR2=" + " 15 minutes at " + timeStr + " with " + consultantName +
        "&VAR3=" + docotrType;
      ``
      new SendNewSMSPublisher(natsWrapper.client).publish({
        to: patient.phoneNumber,
        body: smsBody,
        smsType: SMSType.Transactional,
        smsTemplate: SMSTemplate.PATIENT_APPOINTMENT_REMINDER,
        generatedAt: new Date(),
      });
    }

    //send appointment reminder sms to doctor 
    {
      const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
        "&To=" + consultant.phoneNumber +
        "&TemplateName=" + SMSTemplate.CONSULTANT_APPOINTMENT_REMINDER +
        "&VAR1=" + appointment.consultantName +
        "&VAR2=" + " 15 minutes at " + timeStr;
      ``
      new SendNewSMSPublisher(natsWrapper.client).publish({
        to: consultant.phoneNumber,
        body: smsBody,
        smsType: SMSType.Transactional,
        smsTemplate: SMSTemplate.CONSULTANT_APPOINTMENT_REMINDER,
        generatedAt: new Date(),
      });
    }
    //send appointment reminder email to Patient 
    {

      const emailBody = {
        patientFirstName: makeInitialCapital(appointment.customerFirstName),
        patientLastName: makeInitialCapital(appointment.customerLastName),
        doctorName: appointment.consultantName,
        appointmentId: appointment.id,
        date: date,
        time: timeStr,
        doctorQualification: appointment.consultantQualification,
        docotrType: docotrType
      }
      const objJson = JSON.stringify(emailBody);
      new SendNewEmailPublisher(natsWrapper.client).publish({
        to: patient.emailId,
        cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
        bcc: '',
        from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
        subject: 'Reminder for Appointment',
        body: objJson,
        emailType: EmailType.HtmlText,
        emailTemplate: EmailTemplate.RaminderAppointmentForPatient,
        emaiDeliveryType: EmailDeliveryType.Immediate,
        atExactTime: new Date()
      });
    }

    //send appointment reminder email to doctor 
    {
      const emailBody = {
        patientFirstName: makeInitialCapital(appointment.customerFirstName),
        patientLastName: makeInitialCapital(appointment.customerLastName),
        doctorName: appointment.consultantName,
        appointmentId: appointment.id,
        date: date,
        time: timeStr
      }
      const objJson = JSON.stringify(emailBody);
      new SendNewEmailPublisher(natsWrapper.client).publish({
        to: consultant.emailId,
        cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
        bcc: '',
        from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
        subject: 'Reminder for Appointment',
        body: objJson,
        emailType: EmailType.HtmlText,
        emailTemplate: EmailTemplate.RamainderAppointmentForDoctor,
        emaiDeliveryType: EmailDeliveryType.Immediate,
        atExactTime: new Date()
      });

    }

    msg.ack();
  }
}
