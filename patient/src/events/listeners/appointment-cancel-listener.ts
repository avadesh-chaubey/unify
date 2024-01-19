import { appointmentcancelGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, AppointmentCancelEvent, Subjects, AppointmentStatus, SMSType, SMSTemplate } from '@unifycaredigital/aem';
import { Appointment } from '../../models/appointment-order';
import { Patient } from '../../models/patient';
import { SendNewSMSPublisher } from '../publishers/send-new-sms-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class AppointmentCancelListener extends Listener<AppointmentCancelEvent> {
  subject: Subjects.AppointmentCancelled = Subjects.AppointmentCancelled;
  queueGroupName = appointmentcancelGroupName;

  async onMessage(data: AppointmentCancelEvent['data'], msg: Message) {

    //console.log(data);

    let appointment = await Appointment.findOne({ id: data.appointmentId });
    if (!appointment) {
      console.log("appointment Not found for Id: " + data.appointmentId)
      msg.ack();
      return;
    }
    appointment.set({
      lastAppointmentStatus: appointment.appointmentStatus,
      appointmentStatus: AppointmentStatus.Cancelled,
      appointmentStatusUpdateTime: new Date(),
      appointmentRescheduleEnabled: false
    });
    await appointment.save();

    let patient = await Patient.findById(appointment.customerId);
    if (!patient) {
      console.log("Patient not found for Id: " + appointment.customerId)
      msg.ack();
      return;
    }

    patient.set({
      upcomingAppointmentDate: 'NA',
    })
    await patient.save();

    //////// Send SMS to  patient 
    const smsBody = `From=${String(process.env.SYSTEM_SMS_SENDER_ID)}` +
      "&To=" + patient.phoneNumber +
      "&TemplateName=" + SMSTemplate.CANCEL_APPOINTMENT +
      "&VAR1=" + appointment.customerFirstName + " " + appointment.customerLastName +
      "&VAR2=" + appointment.appointmentDate + " at " + appointment.appointmentSlotId +
      "&VAR2=" + `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}.`;

    new SendNewSMSPublisher(natsWrapper.client).publish({
      to: patient.phoneNumber,
      body: smsBody,
      smsType: SMSType.Transactional,
      smsTemplate: SMSTemplate.CANCEL_APPOINTMENT,
      generatedAt: new Date(),
    });


    msg.ack();
  }
}
