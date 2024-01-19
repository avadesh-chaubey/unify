import express, { Request, Response } from 'express';
import { BadRequestError, requireAuth, AppointmentStatus, ConsultationType, EmailType, EmailTemplate, EmailDeliveryType, ApiResponse } from '@unifycaredigital/aem';
import { Appointment } from '../models/appointment-order';
import { CaseSheet, Vitals } from '../models/case-sheet';
import moment from 'moment';
import { FixedPrice } from '../models/fixed-price';
import { Consultant } from '../models/consultant';
import { SendNewEmailPublisher } from '../events/publishers/send-new-email-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Patient } from '../models/patient';

const router = express.Router();

router.post(
    '/api/patient/updatepatientcaseSheet',
    requireAuth,
    async (req: Request, res: Response) => {

        const {
            id,
            chiefComplaints,
            vitals,
            medicalHistory,
            healthRecords,
            notes,
            diagnosis,
            medicinePrescription,
            testPrescription,
            followUpChatDays,
            adviceInstruction,
            refferral,
            lab,
            isUpdatePdf
        } = req.body;

        const caseSheet = await CaseSheet.findById(id);
        if (!caseSheet) {
            throw new BadRequestError("Invalid caseSheet id");
        }

        const appointment = await Appointment.findById(caseSheet.appointmentId);
        if (!appointment) {
            throw new BadRequestError("Appointment Not found for caseSheet");
        }

        if (appointment.appointmentStatus === AppointmentStatus.CompletedWithError
            || appointment.appointmentStatus === AppointmentStatus.SuccessfullyCompleted
            || appointment.appointmentStatus === AppointmentStatus.Cancelled) {

            if (moment().isAfter(moment(appointment.appointmentDate).format('YYYY_MM_DD'))) {
                throw new BadRequestError("Cannot update caseSheet after 7 days of completed/cancelled appointment");
            }
        }
        //let existingVitals: Vitals = caseSheet.vitals;
        if (vitals && vitals.weigthInKgs && vitals.weigthInKgsDate && vitals.heigthInCms && vitals.heigthInCmsDate) {
            let heighInMeter = vitals.heigthInCms / 100;
            let heighInMeterSquare = Math.pow(heighInMeter, 2);
            vitals.bmi = (Number(vitals.weigthInKgs / heighInMeterSquare).toFixed(2)).toString();

            let weigthInKgsDate = new Date(vitals.weigthInKgsDate);
            let heightDate = new Date(vitals.heigthInCmsDate);

            if (weigthInKgsDate > heightDate) {
                vitals.bmiDate = vitals.weigthInKgsDate;
            } else {
                vitals.bmiDate = vitals.weigthInKgsDate;
            }
        }

        caseSheet.set({
            chiefComplaints,
            vitals,
            medicalHistory,
            healthRecords,
            notes,
            diagnosis,
            medicinePrescription,
            testPrescription,
            followUpChatDays,
            adviceInstruction,
            refferral
        });
        if (lab != '') {
            caseSheet.lab = lab;
        }


        await caseSheet.save();

		const apiResponse: ApiResponse = {
			status: 200,
			message: 'Success',
			data: caseSheet
		}
        res.send(apiResponse);

        if (isUpdatePdf) {
            let patient = await Patient.findById(appointment.customerId);
            if (patient) {
                const makeInitialCapital = (str: any) => {
                    let word = str.toLowerCase().split(" ");
                    for (let i = 0; i < word.length; i++) {
                        word[i] = word[i].charAt(0).toUpperCase() + word[i].substring(1);
                    }
                    return word.join(" ");
                };

                let docotrType = "Diabetologist";
                if (appointment.consultationType == ConsultationType.Diabetologist) {
                    docotrType = "Diabetologist";
                } if (appointment.consultationType == ConsultationType.Dietician) {
                    docotrType = "Dietitian";
                } if (appointment.consultationType == ConsultationType.Educator) {
                    docotrType = "Diabetes Educator";
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

                const currentDate = new Date();
                const birthDate = new Date(appointment.customerDateOfBirth);
                let age = currentDate.getFullYear() - birthDate.getFullYear();

                const date = appointment.appointmentDate.split("-")[2] + "-" + appointment.appointmentDate.split("-")[1] + "-" + appointment.appointmentDate.split("-")[0];

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
                        vitals: caseSheet.vitals,
                        heigthInCms: caseSheet.vitals.heigthInCms,
                        weigthInKgs: caseSheet.vitals.weigthInKgs,
                        bmi: caseSheet.vitals.bmi,
                        bloodPressureDiastolic: caseSheet.vitals.bloodPressureDiastolic,
                        pulse: caseSheet.vitals.pulse,
                        waistCircumference: caseSheet.vitals.waistCircumference,
                        chiefComplaints: caseSheet.chiefComplaints,
                        diagnosis: caseSheet.diagnosis,
                        medicinelist: caseSheet.medicinePrescription,
                        adviceInstruction: caseSheet.adviceInstruction,
                        testPrescription: caseSheet.testPrescription,
                        nextVisit: caseSheet.followUpChatDays,
                        prescriptiondate: date,
                        refferralReason: caseSheet.refferral.reason,
                        refferralconsultSpecialty: caseSheet.refferral.consultSpecialty,
                        isUpdatePdf: `updated`
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
                            ccmailIds = ccmailIds + "," + assistantEmailId;
                        }
                    }

                    ccmailIds = ccmailIds + "," + String(process.env.SYSTEM_RECEIVER_EMAIL_ID);
                    const objJson = JSON.stringify(emailBody);
                    new SendNewEmailPublisher(natsWrapper.client).publish({
                        to: patient.emailId,
                        cc: '',
                        bcc: ccmailIds,
                        from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
                        subject: 'Prescription has been Updated',
                        body: objJson,
                        emailType: EmailType.HtmlText,
                        emailTemplate: EmailTemplate.ConsultationCompleted,
                        emaiDeliveryType: EmailDeliveryType.Immediate,
                        atExactTime: new Date()
                    });
                }
            }
        }
    }
);

export { router as updateCaseSheetRouter };
