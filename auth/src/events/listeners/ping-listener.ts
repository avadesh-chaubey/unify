import { Listener, PingServiceOneEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { Liveness } from '../../models/liveness';
import { pingGroupName } from './queue-group-name';

export class PingListener extends Listener<PingServiceOneEvent> {
  subject: Subjects.PingServiceOne = Subjects.PingServiceOne;
  queueGroupName = pingGroupName;

  async onMessage(data: PingServiceOneEvent['data'], msg: Message) {

    if (data.clientId === String(process.env.NATS_CLIENT_ID)) {
      const liveness = await Liveness.findOne({});
      if (liveness && liveness.currentSerialNumber == data.serialNumber) {
        liveness.set({
          oldSerialNumber: liveness.currentSerialNumber,
          pingCount: 0
        });
        await liveness.save();
      }
    }
    msg.ack();
  }
};
