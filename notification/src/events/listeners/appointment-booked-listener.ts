import { appointmentBookedGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, AppointmentBookedEvent, Subjects } from '@unifycaredigital/aem';
import { Appointment } from '../../models/appointment';
import { fbDatabase } from '../../firebase';
import moment from 'moment';

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

    appointment = Appointment.build({
      id: data.appointmentId,
      consultantId: data.consultantId,
      customerId: data.customerId,
      parentId: data.parentId,
      appointmentDate: data.appointmentDate,
      appointmentSlotId: data.appointmentSlotId,
      consultationType: data.consultationType,
      assistantId: data.assistantId,
      consultantName: 'NA',
      assistantName: 'NA',
      parentName: 'NA',
      patientAgoraUid: 'NA',
      doctorAgoraUid: 'NA',
      assistantAgoraId: 'NA',
      parentEmailId: 'NA',
      consultantEmailId: 'NA',
      assistantEmailId: 'NA'
    })
    await appointment.save();

    if (moment(data.appointmentDate).isSame(moment().utcOffset(330).format('YYYY-MM-DD'))) {
      const uniqueId = data.consultantId;

      const count = await Appointment.find({
        consultantId: data.consultantId,
        appointmentDate: data.appointmentDate,
      }).countDocuments();

      console.log(`New Appointment added for today Total for consultant ${data.consultantId} Count: ${count}`);

      let messagedata = {
        count: count,
        date: data.appointmentDate,
        system: true,
      };
      fbDatabase.ref('appointments/' + uniqueId + '/messages').push().set(messagedata);

      // Do same for assistant
      if (data.assistantId !== 'NA') {
        const uniqueId = data.assistantId;

        const count = await Appointment.find({
          assistantId: data.assistantId,
          appointmentDate: data.appointmentDate,
        }).countDocuments();

        console.log(`New Appointment added for today Total for Assistant ${data.assistantId} Count: ${count}`);

        let messagedata = {
          count: count,
          date: data.appointmentDate,
          system: true,
        };
        fbDatabase.ref('appointments/' + uniqueId + '/messages').push().set(messagedata);
      }
    } else {
      console.log('New Appointment added for other day');
    }

    msg.ack();
  }
}
