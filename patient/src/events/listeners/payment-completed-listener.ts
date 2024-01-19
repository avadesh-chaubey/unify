import { Listener, PaymentCompletedEvent, Subjects, OrderStatus, OrderType, EmailType, EmailTemplate, EmailDeliveryType } from '@unifycaredigital/aem';
import { Message } from 'node-nats-streaming';
import { paymentCompletedGroupName } from './queue-group-name';
import { DeliveryOrder } from '../../models/delivery-order';
import { OrderHistory } from '../../models/order-history';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { SendNewEmailPublisher } from '../publishers/send-new-email-publisher';
import { Patient } from '../../models/patient';

export class PaymentCompletedListener extends Listener<PaymentCompletedEvent> {
  subject: Subjects.PaymentCompleted = Subjects.PaymentCompleted;
  queueGroupName = paymentCompletedGroupName;

  async onMessage(data: PaymentCompletedEvent['data'], msg: Message) {
    console.log('PaymentStatusEvent for id: ', data.productId);

    const deliveryOrder = await DeliveryOrder.findById(data.productId);
    if (!deliveryOrder) {
      msg.ack();
      return;
    }

    deliveryOrder.set({
      status: OrderStatus.Paid,
      arhOrderId: data.arhOrderId,
      paymentMode: data.paymentMode
    });
    await deliveryOrder.save();

    let patient = await Patient.findById(deliveryOrder.patientId);
    if (patient) {
      const objJson = JSON.stringify(deliveryOrder);
      let maillist = [`${String(process.env.SYSTEM_RECEIVER_EMAIL_ID)}`, 'sdaman@unifytech.com'];
      if (deliveryOrder.orderType === OrderType.MedicineAndTestDelivery) {
        //////// Send Email of Pharmacy Order
        new SendNewEmailPublisher(natsWrapper.client).publish({
          to: maillist.toString(),
          cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
          bcc: '',
          from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
          subject: 'New Pharmacy Order ID: ' + deliveryOrder.arhOrderId + ';' + ' Patient ID: ' + patient.mhrId,
          body: objJson,
          emailType: EmailType.HtmlText,
          emailTemplate: EmailTemplate.PharmacyOrder,
          emaiDeliveryType: EmailDeliveryType.Immediate,
          atExactTime: new Date()
        });
        //send separate mails to Test Lab
        new SendNewEmailPublisher(natsWrapper.client).publish({
          to: maillist.toString(),
          cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
          bcc: '',
          from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
          subject: 'New Lab Order ID: ' + deliveryOrder.arhOrderId + ';' + ' Patient ID: ' + patient.mhrId,
          body: objJson,
          emailType: EmailType.HtmlText,
          emailTemplate: EmailTemplate.LabOrder,
          emaiDeliveryType: EmailDeliveryType.Immediate,
          atExactTime: new Date()
        });
        new SendNewEmailPublisher(natsWrapper.client).publish({
          to: patient.emailId,
          cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
          bcc: '',
          from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
          subject: 'Your Order Payment Confirmation',
          body: objJson,
          emailType: EmailType.HtmlText,
          emailTemplate: EmailTemplate.OrderPaymentConfiramtion,
          emaiDeliveryType: EmailDeliveryType.Immediate,
          atExactTime: new Date()
        });
      } else if (deliveryOrder.orderType === OrderType.MedicineDelivery) {
        //send mail to pharmacy only
        new SendNewEmailPublisher(natsWrapper.client).publish({
          to: maillist.toString(),
          cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
          bcc: '',
          from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
          subject: 'New Pharmacy Order ID: ' + deliveryOrder.arhOrderId + ';' + ' Patient ID: ' + patient.mhrId,
          body: objJson,
          emailType: EmailType.HtmlText,
          emailTemplate: EmailTemplate.PharmacyOrder,
          emaiDeliveryType: EmailDeliveryType.Immediate,
          atExactTime: new Date()
        });
        new SendNewEmailPublisher(natsWrapper.client).publish({
          to: patient.emailId,
          cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
          bcc: '',
          from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
          subject: 'Your Order Payment Confirmation',
          body: objJson,
          emailType: EmailType.HtmlText,
          emailTemplate: EmailTemplate.OrderPaymentConfiramtion,
          emaiDeliveryType: EmailDeliveryType.Immediate,
          atExactTime: new Date()
        });
      } else if (deliveryOrder.orderType === OrderType.TestDelivery) {
        //send mail to Lab only
        new SendNewEmailPublisher(natsWrapper.client).publish({
          to: maillist.toString(),
          cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
          bcc: '',
          from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
          subject: 'New Lab Order ID: ' + deliveryOrder.arhOrderId + ';' + ' Patient ID: ' + patient.mhrId,
          body: objJson,
          emailType: EmailType.HtmlText,
          emailTemplate: EmailTemplate.LabOrder,
          emaiDeliveryType: EmailDeliveryType.Immediate,
          atExactTime: new Date()
        });
        new SendNewEmailPublisher(natsWrapper.client).publish({
          to: patient.emailId,
          cc: String(process.env.SYSTEM_RECEIVER_EMAIL_ID),
          bcc: '',
          from: `${String(process.env.SYSTEM_SENDER_EMAIL_ID)}`,
          subject: 'Your Order Payment Confirmation',
          body: objJson,
          emailType: EmailType.HtmlText,
          emailTemplate: EmailTemplate.OrderPaymentConfiramtion,
          emaiDeliveryType: EmailDeliveryType.Immediate,
          atExactTime: new Date()
        });
      }

    }

    let orderHistory = await OrderHistory.findById(deliveryOrder.id);
    if (!orderHistory) {
      orderHistory = OrderHistory.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        patientId: deliveryOrder.patientId,
        parentId: deliveryOrder.parentId,
        priceInINR: deliveryOrder.totalAmountInINR,
        arhOrderid: deliveryOrder.arhOrderId,
        orderType: deliveryOrder.orderType,
        orderDate: new Date(),
        orderId: deliveryOrder.id!,
        orderPaymentStatus: OrderStatus.Paid,
        paymentMode: deliveryOrder.paymentMode
      });
      await orderHistory.save();
    }
    msg.ack();
  }
};
