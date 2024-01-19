import { appointmentCompletedGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, AppointmentCompletedEvent, Subjects, AppointmentStatus, ChatGroupActionType, BadRequestError, SMSTemplate, SMSType, EmailType, EmailTemplate, EmailDeliveryType, UserType, ConsultationType, FollowupReminderType } from '@unifycaredigital/aem';
import mongoose from 'mongoose';
import { Appointment } from '../../models/appointment-order';
import { CaseSheet } from '../../models/case-sheet';
import { Patient } from '../../models/patient';
import { UpdateAppointmentChatGroupPublisher } from '../publishers/update-appointment-chat-group-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { SendNewSMSPublisher } from '../publishers/send-new-sms-publisher';
import { SendNewEmailPublisher } from '../publishers/send-new-email-publisher';
import moment from 'moment';
import { FixedPrice } from '../../models/fixed-price';
import { Consultant } from '../../models/consultant';
import { FollowupReminder } from '../../models/followup-appointment-reminder';



const CHAT_GROUP_DISABLE_WINDOW_IN_SECONDS = 7 * 24 * 60 * 60

export class AppointmentCompletedListener extends Listener<AppointmentCompletedEvent> {
  subject: Subjects.AppointmentCompleted = Subjects.AppointmentCompleted;
  queueGroupName = appointmentCompletedGroupName;

  async onMessage(data: AppointmentCompletedEvent['data'], msg: Message) {

    //console.log(data);

    const appointment = await Appointment.findById(data.appointmentId);
    if (!appointment) {
      console.log("appointment Not found for Id: " + data.appointmentId)
      msg.ack();
      return;
    } else {
      if (appointment.appointmentStatus === AppointmentStatus.SuccessfullyCompleted
        || appointment.appointmentStatus === AppointmentStatus.CompletedWithError) {
        msg.ack();
        return;
      }
      let appointmentStatus = AppointmentStatus.SuccessfullyCompleted;

      if (!data.successfullyCompleted) {
        appointmentStatus = AppointmentStatus.CompletedWithError;
      }
      appointment.set({
        lastAppointmentStatus: appointment.appointmentStatus,
        appointmentStatus: appointmentStatus,
        appointmentStatusUpdateTime: new Date(),
        appointmentSummary: data.remarks,
        appointmentRescheduleEnabled: false
      });
      await appointment.save();
    }
    let patient = await Patient.findById(appointment.customerId);
    if (!patient) {
      console.log("Patient not found for Id: " + appointment.customerId)
      msg.ack();
      return;
    }
    patient.set({
      upcomingAppointmentDate: 'NA',
      followupConsultationDate: data.followupConsultationDate
    })
    await patient.save();


    if (data.successfullyCompleted && appointment.consultationType === ConsultationType.Diabetologist) {
      const daySevenDate = moment(String(data.followupConsultationDate), 'YYYY-MM-DD').subtract(7, 'days').format('YYYY-MM-DD');
      console.log('daySevenDate: ' + daySevenDate);
      const daySevenReminder = FollowupReminder.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        consultantName: appointment.consultantName,
        consultationType: appointment.consultationType,
        followupReminderDate: daySevenDate,
        parentPhoneNumber: appointment.parentPhoneNumber,
        customerName: appointment.customerName,
        followupReminderType: FollowupReminderType.SevenDaysBefore
      });
      await daySevenReminder.save()

      const dayThreeDate = moment(String(data.followupConsultationDate), 'YYYY-MM-DD').subtract(3, 'days').format('YYYY-MM-DD');
      console.log('dayThreeDate: ' + dayThreeDate);
      const dayThreeReminder = FollowupReminder.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        consultantName: appointment.consultantName,
        consultationType: appointment.consultationType,
        followupReminderDate: dayThreeDate,
        parentPhoneNumber: appointment.parentPhoneNumber,
        customerName: appointment.customerName,
        followupReminderType: FollowupReminderType.ThreeDaysBefore
      });
      await dayThreeReminder.save()

      console.log('dayReminderDate: ' + String(data.followupConsultationDate));
      const dayReminder = FollowupReminder.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        consultantName: appointment.consultantName,
        consultationType: appointment.consultationType,
        followupReminderDate: String(data.followupConsultationDate),
        parentPhoneNumber: appointment.parentPhoneNumber,
        customerName: appointment.customerName,
        followupReminderType: FollowupReminderType.Today
      });
      await dayReminder.save()
    }

    let name = appointment.consultantName;
    if (data.updatedBy === UserType.PhysicianAssistant) {
      name = appointment.assistantName;
    }
    const currentTime = String(moment().utcOffset(330).format('ddd DD-MMM-YYYY, hh:mm A'));
    const updation = new Date();

    updation.setSeconds(updation.getSeconds() + CHAT_GROUP_DISABLE_WINDOW_IN_SECONDS);

    ///// Publish Update Appointment Chat Group Message //////////////
    new UpdateAppointmentChatGroupPublisher(natsWrapper.client).publish({
      appointmentId: appointment.id!,
      patientId: appointment.customerId,
      consultantId: appointment.consultantId,
      assistantId: appointment.assistantId,
      appointmentDate: appointment.appointmentDate,
      appointmentSlotId: appointment.appointmentSlotId,
      remarks: `Remarks: ${appointment.appointmentSummary} \nAppointment completed by ${name} ${currentTime}`,
      chatGroupAction: ChatGroupActionType.REMOVECHATGROUP,
      updateChatGroupAtTime: updation,
      parentId: appointment.parentId,
      patientName: appointment.parentName,
      consultantName: appointment.consultantName,
      assistantName: appointment.assistantName,
      parentName: appointment.parentName,
      parentEmailId: 'NA',
      consultantEmailId: 'NA',
      assistantEmailId: 'NA',
    });

    //////// Send SMS to  patient 
    const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
      "&To=" + patient.phoneNumber +
      "&TemplateName=" + SMSTemplate.CONSULTATION_COMPLETE +
      "&VAR1=" + `${String(process.env.SYSTEM_RECEIVER_EMAIL_ID)}.`;

    new SendNewSMSPublisher(natsWrapper.client).publish({
      to: patient.phoneNumber,
      body: smsBody,
      smsType: SMSType.Transactional,
      smsTemplate: SMSTemplate.CONSULTATION_COMPLETE,
      generatedAt: new Date(),
    });
    const casesheet = await CaseSheet.findOne({ appointmentId: data.appointmentId });
    console.log("casesheet: " + casesheet);
    console.log("vitals: " + casesheet?.vitals);
    if (casesheet) {
      const makeInitialCapital = (str: any) => {
        let word = str.toLowerCase().split(" ");
        for (let i = 0; i < word.length; i++) {
          word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
        }
        return word.join(" ");
      };
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
      const date = appointment.appointmentDate.split("-")[2] + "-" + appointment.appointmentDate.split("-")[1] + "-" + appointment.appointmentDate.split("-")[0];

      const currentDate = new Date();
      const birthDate = new Date(appointment.customerDateOfBirth);
      let age = currentDate.getFullYear() - birthDate.getFullYear();

      let docotrType = "Diabetologist";
      if (appointment.consultationType == ConsultationType.Diabetologist) {
        docotrType = "Diabetologist";
      } if (appointment.consultationType == ConsultationType.Dietician) {
        docotrType = "Dietitian";
      } if (appointment.consultationType == ConsultationType.Educator) {
        docotrType = "Diabetes Educator";
      }
      // BMI calculation
      let bmivalue = "";
      if (casesheet.vitals && casesheet.vitals.weigthInKgs && casesheet.vitals.weigthInKgsDate && casesheet.vitals.heigthInCms && casesheet.vitals.heigthInCmsDate) {
        let heighInMeter = casesheet.vitals.heigthInCms / 100;
        let heighInMeterSquare = Math.pow(heighInMeter, 2);
        bmivalue = (Number(casesheet.vitals.weigthInKgs / heighInMeterSquare).toFixed(2)).toString();
      }

      const existingFixedPrice = await FixedPrice.findOne({});
      if (existingFixedPrice) {

        const emailBody = {
          patientFirstName: makeInitialCapital(patient.userFirstName),
          patientLastName: makeInitialCapital(patient.userLastName),
          doctorName: appointment.consultantName,
          doctordetails1: appointment.consultantQualification,
          doctordetails2: docotrType,
          hospitalName: existingFixedPrice.hospitalName,
          hospitaladd1: `${existingFixedPrice.hospitalAddress}, ${existingFixedPrice.hospitalCity}, ${existingFixedPrice.hospitalState} – ${existingFixedPrice.hospitalPincode}`,
          hospitaladd2: `Contact: ${existingFixedPrice.hospitalPhoneNumber} Email: ${existingFixedPrice.hospitalEmail}`,
          mdrNo: patient.mhrId,
          date: date,
          time: timeStr,
          consultType: makeInitialCapital(appointment.consultationType),
          patientName: appointment.customerName,
          patientAge: age,
          patientGender: appointment.customerGender,
          appointmentId: appointment.id,
          vitals: casesheet.vitals,
          heigthInCms: casesheet.vitals.heigthInCms,
          weigthInKgs: casesheet.vitals.weigthInKgs,
          bmi: bmivalue,
          bloodPressureDiastolic: casesheet.vitals.bloodPressureDiastolic,
          pulse: casesheet.vitals.pulse,
          waistCircumference: casesheet.vitals.waistCircumference,
          chiefComplaints: casesheet.chiefComplaints,
          diagnosis: casesheet.diagnosis,
          medicinelist: casesheet.medicinePrescription,
          adviceInstruction: casesheet.adviceInstruction,
          testPrescription: casesheet.testPrescription,
          nextVisit: casesheet.followUpChatDays,
          prescriptiondate: date,
          refferralReason: casesheet.refferral.reason,
          refferralconsultSpecialty: casesheet.refferral.consultSpecialty,
          isUpdatePdf: `completed`
        }
        let ccmailIds = "";
        let consultantEmailId = 'NA';
        const appConsultant = await Consultant.findById(appointment.consultantId);
        if (appConsultant) {
          consultantEmailId = appConsultant.emailId;
          ccmailIds = consultantEmailId;
        }
        let assistantEmailId = 'NA';
        if (appointment.consultationType === ConsultationType.Diabetologist && appointment.assistantId !== 'NA') {
          const appAssistant = await Consultant.findById(appointment.assistantId);
          if (appAssistant) {
            assistantEmailId = appAssistant.emailId;
            //ccmailIds = ccmailIds + "," + assistantEmailId;
          }
        }

        ccmailIds = ccmailIds + "," + String(process.env.SYSTEM_RECEIVER_EMAIL_ID);
        const objJson = JSON.stringify(emailBody);
        new SendNewEmailPublisher(natsWrapper.client).publish({
          to: patient.emailId,
          cc: assistantEmailId,
          bcc: ccmailIds,
          from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
          subject: 'Consultation has been Completed',
          body: objJson,
          emailType: EmailType.HtmlText,
          emailTemplate: EmailTemplate.ConsultationCompleted,
          emaiDeliveryType: EmailDeliveryType.Immediate,
          atExactTime: new Date()
        });
      }
    } else {
      console.log("casheet not found for appointmentid:" + appointment.id);
    }

    msg.ack();
  }
}
