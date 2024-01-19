import { appointmentUpdatedGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, AppointmentUpdatedEvent, Subjects, AppointmentUpdateType } from '@unifycaredigital/aem';
import { Appointment } from '../../models/appointment';
import moment from 'moment';
import { fbDatabase } from '../../firebase';

export class AppointmentUpdatedListener extends Listener<AppointmentUpdatedEvent> {
  subject: Subjects.AppointmentUpdated = Subjects.AppointmentUpdated;
  queueGroupName = appointmentUpdatedGroupName;

  async onMessage(data: AppointmentUpdatedEvent['data'], msg: Message) {
    console.log('AppointmentUpdatedEvent Received for Update Type: ', data.updateType);

    const appointment = await Appointment.findById(data.appointmentId);

    if (appointment) {

      if (data.updateType === AppointmentUpdateType.Rescheduled) {
        appointment.set({
          consultantId: data.consultantId,
          customerId: data.customerId,
          parentId: data.parentId,
          appointmentDate: data.appointmentDate,
          appointmentSlotId: data.appointmentSlotId,
          consultationType: data.consultationType,
          assistantId: data.assistantId,
        })
        await appointment.save();

        if (moment(data.appointmentDate).isSame(moment().utcOffset(330).format('YYYY-MM-DD'))) {
          const uniqueId = data.consultantId;

          const count = await Appointment.find({
            consultantId: data.consultantId,
            appointmentDate: data.appointmentDate,
          }).countDocuments();

          console.log(`New Appointment added for today. Consultant total appointments ${data.consultantId} Count: ${count}`);

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

            console.log(`New Appointment added for today. Assistant total appointments ${data.assistantId} Count: ${count}`);

            let messagedata = {
              count: count,
              date: data.appointmentDate,
              system: true,
            };
            fbDatabase.ref('appointments/' + uniqueId + '/messages').push().set(messagedata);
          }
        }
      }
    }

    msg.ack();
  }
}
