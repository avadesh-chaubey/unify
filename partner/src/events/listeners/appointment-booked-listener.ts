import { appointmentBookedGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, AppointmentBookedEvent, Subjects } from '@unifycaredigital/aem';
import { Appointment } from '../../models/appointment';
import { User } from '../../models/user';
import { PartnerEmployee } from '../../models/partner-employee';

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

    let patient = await User.findById(data.customerId);
    if (!patient) {
      console.log("Patient not found for Id: " + data.customerId)
      msg.ack();
      return;
    }

    let assistantName = 'NA';
    if (data.assistantId !== 'NA') {
      let assistant = await PartnerEmployee.findById(data.assistantId)
      if (assistant) {
        assistantName = assistant.title + " " + assistant.userFirstName + " " + assistant.userLastName;
      }
    }
    let consultantName = 'NA';
    if (data.assistantId !== 'NA') {
      let consultant = await PartnerEmployee.findById(data.consultantId)
      if (consultant) {
        consultantName = consultant.title + " " + consultant.userFirstName + " " + consultant.userLastName;
      }
    }

    console.log("appointment booked:  " + patient.userName);
    appointment = Appointment.build({
      id: data.appointmentId,
      consultantId: data.consultantId,
      customerId: data.customerId,
      partnerId: data.partnerId,
      parentId: data.parentId,
      basePriceInINR: data.basePriceInINR,
      consultationType: data.consultationType,
      appointmentDate: data.appointmentDate,
      appointmentSlotId: data.appointmentSlotId,
      appointmentStatus: data.appointmentStatus,
      appointmentCreationTime: data.appointmentCreationTime,
      customerName: patient.userName,
      assistantId: data.assistantId,
      parentPhoneNumber: patient.phoneNumber,
      assistantName: assistantName,
      consultantName: consultantName,
    })
    await appointment.save();

    msg.ack();
  }
}
