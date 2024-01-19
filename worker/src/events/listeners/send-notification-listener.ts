import { sendNotificationGroupName } from './queue-group-name';
import { sendNotificationQueue } from '../../queues/send-notification-queue';
import { Message } from 'node-nats-streaming';
import { Listener, SendNotificationEvent, Subjects, NotificationType } from '@unifycaredigital/aem';

export class SendNotificationListener extends Listener<SendNotificationEvent> {
  subject: Subjects.SendNotification = Subjects.SendNotification;
  queueGroupName = sendNotificationGroupName;

  async onMessage(data: SendNotificationEvent['data'], msg: Message) {

    let delay = new Date(data.sendDateAndTime).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process notification:', delay);

    //see if message is already 10 sec delayed
    if ((delay + 10000) < 0) {
      msg.ack();
      return;
    }

    delay = 1000; //fixing to 1 sec for now

    for (let i = 0; i < data.to.length; i++) {
      const chromeData = {
        to: data.to[i],
        data: {
          notification: {
            "title": data.title,
            "body": data.body,
          }
        }
      };

      delay = delay + i * 100 //adding 100 MS gap in each notification

      var options = {
        'method': 'POST',
        'url': data.url,
        'headers': {
          'Authorization': data.key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chromeData)
      };
      try {
        if(data.type === NotificationType.VoipCall){
        await sendNotificationQueue.add({
          notification: JSON.parse(data.body),
          type: data.type,
          registrationIOSIds: data.to
        },
          {
            delay,
          }
        );
        
          delay = delay + 8000;
          var iosData  = JSON.parse(data.body);
          const iosSilentData1 = {
            retries: 1,
            title: "Diahome",
            body: "Online Video Consultation",
            priority: 'high',
            alert: 'new pushkit',
            custom: {collapseKey: 1},
            topic: iosData.topic,
            silent: true,
            contentAvailable: 1
        };
        
          await sendNotificationQueue.add({
            notification: iosSilentData1,
            type: data.type,
            registrationIOSIds: data.to
          },
            {
              delay,
            }
          );
          console.log('iosSilentData1 : ' + JSON.stringify(iosSilentData1));

          iosData.collapseKey = 2;
          delay = delay + 2000;
          await sendNotificationQueue.add({
            notification: iosData,
            type: data.type,
            registrationIOSIds: data.to
          },
            {
              delay,
            }
          );
          console.log('iosData2 : ' + JSON.stringify(iosData));
          delay = delay + 8000;
          const iosSilentData2 = {
            retries: 1,
            title: "Diahome",
            body: "Online Video Consultation",
            priority: 'high',
            alert: 'new pushkit',
            custom: {collapseKey: 2},
            topic: iosData.topic,
            silent: true,
            contentAvailable: 1
        };
          await sendNotificationQueue.add({
            notification: iosSilentData2,
            type: data.type,
            registrationIOSIds: data.to
          },
            {
              delay,
            }
          );
          console.log('iosSilentData2 : ' + JSON.stringify(iosSilentData2));
          delay = delay + 2000;
          iosData.collapseKey = 3;
          await sendNotificationQueue.add({
            notification: iosData,
            type: data.type,
            registrationIOSIds: data.to
          },
            {
              delay,
            }
          );
          console.log('iosData3 : ' + JSON.stringify(iosData));
          delay = delay + 8000;
          const iosSilentData3 = {
            retries: 1,
            title: "Diahome",
            body: "Online Video Consultation",
            priority: 'high',
            alert: 'new pushkit',
            custom: {collapseKey: 3},
            topic: iosData.topic,
            silent: true,
            contentAvailable: 1
        };
          await sendNotificationQueue.add({
            notification: iosSilentData3,
            type: data.type,
            registrationIOSIds: data.to
          },
            {
              delay,
            }
          );
          console.log('iosSilentData3 : ' + JSON.stringify(iosSilentData3));

        } else {
          await sendNotificationQueue.add({
            notification: options,
            type: data.type,
            registrationIOSIds: data.to
          },
            {
              delay,
            }
          );
        }
        msg.ack();
      } catch (error) {
        msg.ack();
        console.error(error);
      }
    }

    msg.ack();
  }
}
