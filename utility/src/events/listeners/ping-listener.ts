import { Listener, PingServiceSixEvent, Subjects } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { Liveness } from '../../model/liveness';
import { pingGroupName } from './queue-group-name';

export class PingListener extends Listener<PingServiceSixEvent> {
  subject: Subjects.PingServiceSix = Subjects.PingServiceSix;
  queueGroupName = pingGroupName;

  async onMessage(data: PingServiceSixEvent['data'], msg: Message) {

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
