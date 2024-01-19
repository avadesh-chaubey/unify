import { sendNewEmailGroupName } from './queue-group-name';
import { sendNewEmailQueue } from '../../queues/send-new-email-queue';
import { Message } from 'node-nats-streaming';
import { EmailTemplate, Listener, sendNewEmailEvent, Subjects } from '@unifycaredigital/aem';
import EmailTemp from 'email-templates';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import moment from 'moment';
import { prescritionPDFUploadQueue } from '../../queues/prescription-pdf-upload-queue';

Handlebars.registerPartial('header', fs.readFileSync(path.join(__dirname, '../../templates/partials/header.hbs'), 'utf8'));
Handlebars.registerPartial('footer', fs.readFileSync(path.join(__dirname, '../../templates/partials/footer.hbs'), 'utf8'));

export class SendNewEmailListener extends Listener<sendNewEmailEvent> {
  subject: Subjects.SendNewEmail = Subjects.SendNewEmail;
  queueGroupName = sendNewEmailGroupName;

  async onMessage(data: sendNewEmailEvent['data'], msg: Message) {


    let delay = new Date(data.atExactTime).getTime() - new Date().getTime();


    //see if message is already 10 min delayed
    if ((delay + 600000) < 0) {
      msg.ack();
      return;
    }

    delay = 1000; //fixing to 1 sec for now
    console.log('Waiting this many milliseconds to process email:', delay);
    let content = data.body;
    // let fileName = 'logo_name.png';
    // let filePath = path.join(__dirname, '../../templates/logo_name.png');
    // let fileCid = "logo@cid";

    if (data.emailTemplate === EmailTemplate.ConsultationCompleted) {
      console.log("TestPrescription listener ");
      // try {

      const emailConfig: any = {
        views: {
          root: path.join(__dirname, '../../templates'),
          options: {
            extension: 'hbs',
          },
        },
      }
      const emailTmp = new EmailTemp(emailConfig);

      const object = JSON.parse(data.body);

      content = await emailTmp.render(data.emailTemplate, object);

      await prescritionPDFUploadQueue.add(
        {
          to: data.to,
          cc: data.cc,
          bcc: data.bcc,
          from: data.from,
          subject: data.subject,
          body: data.body,
          emailType: data.emailType,
          emailTemplate: data.emailTemplate,
          emaiDeliveryType: data.emaiDeliveryType,
          atExactTime: data.atExactTime,
          html: content,
        },
        {
          delay,
        }

      );
      msg.ack();
      return;
      // } catch (error) {
      //   msg.ack();
      //   console.error(error);
      // }
    }

    if (data.emailTemplate === EmailTemplate.PharmacyOrder) {
      const object = JSON.parse(data.body);
      // fileName = ""; filePath = ""; fileCid = "";
      try {
        const object = JSON.parse(data.body);
        content = await pharmacyDetails(object);
      } catch (error) {
        msg.ack();
        console.log(error);
      }
    }
    if (data.emailTemplate === EmailTemplate.LabOrder) {
      const object = JSON.parse(data.body);
      // fileName = ""; filePath = ""; fileCid = "";
      try {
        const object = JSON.parse(data.body);
        content = await labDetails(object);
      } catch (error) {
        msg.ack();
        console.log(error);
      }
    }
    if (data.emailTemplate === EmailTemplate.OrderPaymentConfiramtion) {
      const object = JSON.parse(data.body);
      // fileName = ""; filePath = ""; fileCid = "";
      try {
        content = await orderPaymetDetails(object);

      } catch (error) {
        msg.ack();
        console.log(error);
      }
    }
    if (data.emailTemplate != EmailTemplate.NoTemplate
      && data.emailTemplate != EmailTemplate.LabOrder
      && data.emailTemplate != EmailTemplate.PharmacyOrder
      && data.emailTemplate != EmailTemplate.OrderPaymentConfiramtion) {
      const emailConfig: any = {
        views: {
          root: path.join(__dirname, '../../templates'),
          options: {
            extension: 'hbs',
          },
        },
      }
      const emailTmp = new EmailTemp(emailConfig);

      const object = JSON.parse(data.body);

      content = await emailTmp.render(data.emailTemplate, object);
    }

    try {
      // console.log("to: "+data.to);
      // console.log("from: "+data.from);
      // console.log("content in email: "+content);
      // console.log("subject: "+data.subject);

      await sendNewEmailQueue.add(
        {
          to: data.to,
          Cc: data.cc,
          Bcc: data.bcc,
          from: data.from,
          subject: data.subject,
          body: content
        },
        {
          delay,
        }

      );
      msg.ack();
    } catch (error) {
      msg.ack();
      console.error(error);
    }
    msg.ack();
  }
}



async function pharmacyDetails(data: any) {
  let time = Math.floor(data.appointmentSlotId / 4);
  let suffix = "AM";
  if (time >= 12) {
    suffix = "PM";
  }
  if (time > 12) {
    time = time - 12;
  }
  let minutes = ((data.appointmentSlotId % 4) * 15);
  let minutesStr = "";
  if (minutes < 10) {
    minutesStr = minutesStr.concat(minutes.toString(), "0");
  } else {
    minutesStr = minutes.toString();
  }
  const timeStr = time + ":" + minutesStr + " " + suffix;
  let body1 = '    <div style="width: 100%;height: 160px;">  ' +
    '               <div style="width: 40%; float: left;font-size: 14px">  ' +
    '                   <p style="font-size: 15px; font-weight: bold;">Order Details</p>  ' +
    '                   <p style="margin:0"><span style="font-weight: bold;">ID: </span><span>' + (data.arhOrderId != undefined ? data.arhOrderId : "-") + '</span></p>  ' +
    '                   <p style="margin:0"><span style="font-weight: bold;">Date: </span><span>' + String(moment().utcOffset(330).format('DD-MM-YYYY')) + '</span></p>  ' +
    '                   <p style="margin:0"><span style="font-weight: bold;">Time: </span><span>' + String(moment().utcOffset(330).format('hh:mm A')) + '</span></p>  ' +
    '                     ' +
    '               </div>  ' +
    '               <div style="width: 60%; float: right;font-size: 14px">  ' +
    '                       <p style="font-size: 15px;font-weight: bold;">Patient Details</p>  ' +
    '                       <p style="margin:0">' + (data.patientName != undefined ? data.patientName : "-") + '</p>  ' +
    '                       <p style="margin:0">' + (data.patientAge != undefined ? data.patientAge : "-") + "," + (data.patientGender != undefined ? data.patientGender : "-") + '</p>  ' +
    '                       <p style="margin:0">ARH ID: ' + (data.patientARHId != undefined ? data.patientARHId : "-") + '</p>  ' +
    '                       <p style="margin:0">Phone: ' + (data.patientPhone != undefined ? data.patientPhone : "-") + '</p>  ' +
    '                       <p style="margin:0">Email: ' + (data.patientEmail != undefined ? data.patientEmail : "-") + '</p>  ' +
    '               </div>  ' +
    '           </div>  ' +
    '       <br>  ' +
    '       <br>  ' +
    '       <div style="width: 100%;height: 130px;">  ' +
    '           <div style="width: 40%; float: left;font-size: 14px">  ' +
    '               <p style="font-size: 15px; font-weight: bold;">Appointment Details</p>  ' +
    '               <p style="margin:0"><span style="font-weight: bold;">Date: </span><span>' + String(moment(data.appointmentDate, 'YYYY-MM-DD').utcOffset(330).format('DD-MM-YYYY')) + '</span></p>  ' +
    '               <p style="margin:0"><span style="font-weight: bold;">Time: </span><span>' + (timeStr != undefined ? timeStr : "-") + '</span></p>  ' +
    '               <p style="margin:0"><span style="font-weight: bold;">Doctor Name: </span><span>' + (data.consultantName != undefined ? data.consultantName : "-") + '</span></p>  ' +
    '           </div>  ' +
    '           <div style="width: 60%; float: right;font-size: 14px">  ' +
    '                   <p style="font-size: 15px;font-weight: bold;">Patient Address</p>  ' +
    '                   <p style="margin:0;width:400px">' + (data.deliveryAddress != undefined ? data.deliveryAddress : "-") + '</p>  ' +
    '                   <p style="margin:0;width:400px">' + (data.city != undefined ? data.city : "-") + "," + (data.state != undefined ? data.state : "-") + "," + (data.pincode != undefined ? data.pincode : "-") + '</p>  ' +
    '           </div>  ' +
    '       </div>  ' +
    '       <br>  ' +
    '       <br>  ' +
    '       <p style="font-size: 15px; font-weight: bold;">Pharmacy Order Summary:</p>  '
    ;
  let tbody1 = '<table border="1"><thead><tr><th style="width:50px"></th><th style="width:200px;text-align:left">Medicine Type</th><th style="width:300px;text-align:left">Medicine Name</th><th style="width:100px;text-align:left">Pack of</th><th style="width:200px;text-align:left;">Price</th></tr></thead><tbody>';
  let tbody2 = "</tbody></table>"
  let subTotal = 0;
  if (data.medicinePrescription) {
    for (let i = 0; i < data.medicinePrescription.length; i++) {
      let snumber = i + 1;
      tbody1 = tbody1 + "<tr><td style='width:50px'>" + snumber + "</td>" + "<td style='width:200px'>" + data.medicinePrescription[i].medicineType + "</td>" + "<td style='width:300px'>" + data.medicinePrescription[i].nameOfTheDrug + "</td><td style='width:100px;'>" + data.medicinePrescription[i].numberOfUnits + "</td><td style='width:100px;'>Rs." + Number((data.medicinePrescription[i].MRP * data.medicinePrescription[i].numberOfUnits)).toFixed(2) + "</td></tr>";
      subTotal = subTotal + Number((data.medicinePrescription[i].MRP * data.medicinePrescription[i].numberOfUnits));
    }
  }
  let body2 = '   <hr style="width:880px;margin:0">  ' +
    '      <p style="background-color:#e4e4e4;height: 20px;width:880px;font-weight:bold"><span >Sub Total</span><span style="padding-left: 623px;">Rs.' + subTotal.toFixed(2) + '</span></p>  ';

  let body3 = '<p style="background-color:#e4e4e4;height: 20px;width:880px;font-weight:bold"><span>Shipping Charges</span><span style="padding-left: 568px;">Rs.' + Number(data.shippingChargesInINR).toFixed(2) + '</span></p>  ';

  let body4 = '   <hr style="width:880px;margin:0">  ' +
    '      <p style="background-color:#e4e4e4;height: 20px;width:880px;font-weight:bold"><span style="font-weight: bold;">Total (after discount if any)</span><span style="padding-left: 513px;">Rs.' + Number(data.medicineTotalAmountInINR + data.shippingChargesInINR).toFixed(2) + '</span></p>';

  let body5 = '<hr style="width:880px;margin:0">  ';

  return body1 + tbody1 + tbody2 + body2 + body3 + body4 + body5;
}
async function labDetails(data: any) {
  let time = Math.floor(data.appointmentSlotId / 4);
  let suffix = "AM";
  if (time >= 12) {
    suffix = "PM";
  }
  if (time > 12) {
    time = time - 12;
  }
  let minutes = ((data.appointmentSlotId % 4) * 15);
  let minutesStr = "";
  if (minutes < 10) {
    minutesStr = minutesStr.concat(minutes.toString(), "0");
  } else {
    minutesStr = minutes.toString();
  }
  const timeStr = time + ":" + minutesStr + " " + suffix;

  let body1 = '    <div style="width: 100%;height: 160px;">  ' +
    '               <div style="width: 40%; float: left;font-size: 14px">  ' +
    '                   <p style="font-size: 15px; font-weight: bold;">Order Details</p>  ' +
    '                   <p style="margin:0"><span style="font-weight: bold;">ID: </span><span>' + (data.arhOrderId != undefined ? data.arhOrderId : "-") + '</span></p>  ' +
    '                   <p style="margin:0"><span style="font-weight: bold;">Date: </span><span>' + String(moment().utcOffset(330).format('DD-MMM-YYYY')) + '</span></p>  ' +
    '                   <p style="margin:0"><span style="font-weight: bold;">Time: </span><span>' + String(moment().utcOffset(330).format('hh:mm A')) + '</span></p>  ' +
    '                     ' +
    '               </div>  ' +
    '               <div style="width: 60%; float: right;font-size: 14px">  ' +
    '                       <p style="font-size: 15px;font-weight: bold;">Patient Details</p>  ' +
    '                       <p style="margin:0">' + (data.patientName != undefined ? data.patientName : "-") + '</p>  ' +
    '                       <p style="margin:0">' + (data.patientAge != undefined ? data.patientAge : "-") + "," + (data.patientGender != undefined ? data.patientGender : "-") + '</p>  ' +
    '                       <p style="margin:0">ARH ID: ' + (data.patientARHId != undefined ? data.patientARHId : "-") + '</p>  ' +
    '                       <p style="margin:0">Phone: ' + (data.patientPhone != undefined ? data.patientPhone : "-") + '</p>  ' +
    '                       <p style="margin:0">Email: ' + (data.patientEmail != undefined ? data.patientEmail : "-") + '</p>  ' +
    '               </div>  ' +
    '           </div>  ' +
    '       <br>  ' +
    '       <br>  ' +
    '       <div style="width: 100%;height: 130px;">  ' +
    '           <div style="width: 40%; float: left;font-size: 14px">  ' +
    '               <p style="font-size: 15px; font-weight: bold;">Appointment Details</p>  ' +
    '               <p style="margin:0"><span style="font-weight: bold;">Date: </span><span>' + String(moment(data.appointmentDate, 'YYYY-MM-DD').utcOffset(330).format('DD-MM-YYYY')) + '</span></p>  ' +
    '               <p style="margin:0"><span style="font-weight: bold;">Time: </span><span>' + (timeStr != undefined ? timeStr : "-") + '</span></p>  ' +
    '                 <p style="margin:0"><span style="font-weight: bold;">Doctor Name: </span><span>' + (data.consultantName != undefined ? data.consultantName : "-") + '</span></p>  ' +
    '           </div>  ' +
    '           <div style="width: 60%; float: right;font-size: 14px">  ' +
    '                   <p style="font-size: 15px;font-weight: bold;">Patient Address</p>  ' +
    '                   <p style="margin:0;width:400px">' + (data.deliveryAddress != undefined ? data.deliveryAddress : "-") + '</p>  ' +
    '                   <p style="margin:0";width:400px>' + (data.city != undefined ? data.city : "-") + "," + (data.state != undefined ? data.state : "-") + "," + (data.pincode != undefined ? data.pincode : "-") + '</p>  ' +
    '           </div>  ' +
    '       </div>  ' +
    '       <br>  ' +
    '       <br>  ' +
    '       <p style="font-size: 15px; font-weight: bold;">Lab Order Summary:</p>  '
    ;

  let tbody1 = '<table border="1"><thead><tr><th width="50px"></th><th style="width:200px;text-align:left">Lab</th><th style="width:400px;text-align:left">Test Name</th><th style="width:200px;text-align:left">Price</th></tr></thead><tbody>';
  let tbody2 = "</tbody></table>"
  let subTotal = 0;
  if (data.testPrescription) {
    for (let i = 0; i < data.testPrescription.length; i++) {
      const lab = data.testPrescription[i].lab ? data.testPrescription[i].lab : 'ARH'
      let snumber = i + 1;
      tbody1 = tbody1 + "<tr><td style='width:50px'>" + snumber + "</td>" + "<td style='width:200px'>" + lab + "</td>" + "<td style='width:400px'>" + data.testPrescription[i].serviceType + "</td><td style='width:200px'>Rs." + Number(data.testPrescription[i].cost).toFixed(2) + "</td></tr>";
      subTotal = subTotal + Number(data.testPrescription[i].cost);
    }
  }
  let body2 = '   <hr style="width:880px;margin:0;">  ' +
    '      <p style="background-color:#e4e4e4;height: 20px;width:880px;font-weight:bold;"><span >Sub Total</span><span style="padding-left: 610px;">Rs.' + subTotal.toFixed(2) + '</span></p>  ';

  let body3 = '<p style="background-color:#e4e4e4;height: 20px;width:880px;font-weight:bold;"><span>Home collection Charges</span><span style="padding-left: 513px;;">Rs.' + Number(data.homeCollectionChargesInINR).toFixed(2) + '</span></p>  ';
  let body4 = '   <hr style="width:880px;margin:0">  ' +
    '      <p style="background-color:#e4e4e4;height: 20px;width:880px;font-weight:bold;"><span style="font-weight: bold;">Total</span><span style="padding-left: 635px;">Rs.' + Number(data.diagnosticTestTotalAmountInINR + data.homeCollectionChargesInINR).toFixed(2) + '</span></p>';

  let body5 = '<hr style="width:880px;margin:0">  ';

  return body1 + tbody1 + tbody2 + body2 + body3 + body4 + body5;
}

async function orderPaymetDetails(data: any) {
  let lab1 = '';
  let lab2 = '';
  let lab3 = '';
  let lab4 = '';
  let lab5 = '';
  let lab6 = '';
  let lab7 = '';

  let underline = '';
  let underline1 = '';
  let maintotal = '';

  let medicine = '';
  let medicine1 = '';
  let medicine2 = '';
  let medicine3 = '';
  let medicine4 = '';
  let medicine5 = '';
  let medicine6 = '';
  let mainbody = '<div style="max-width: 600px; height: 45px;background: linear-gradient(#04979b,#60c9cd);">  ' +
    `           <img style=" width: 150px;float: left;color: #f1f1f1;margin-left: 15px;margin-top: 5px; " src="https://storage.googleapis.com/diahome-com-bucket-1/Image/logo_name.png"/>  ` +
    '           <div style="text-align: right;color: #f1f1f1;margin-right: 20px; margin-top: 30px;padding: 2px;">  ' +
    '             <p style="font-size: 8px;margin-top: 13px;line-height:0px">Call us at<span>:</span>7540001234</p>  ' +
    `             <p style="font-size: 8px;margin-top:0px;">Download the ${String(process.env.SYSTEM_SENDER_FULL_NAME)} App</p>  ` +
    '          </div>  ' +
    '       </div>  ' +
    '           <p style="font-weight: bold;padding-left: 20px;">Hello ' + (data.patientName != undefined ? data.patientName : "-") + ',</p>  ' +
    '           <p style="padding-left: 20px;">Thank you for choosing us. Please find your order summary below.</p>  ';
  if (Number(data.medicineTotalAmountInINR) > 0) {
    medicine = '<h6 style="background-color:#24347c;height: 100%;width:560px;color: #f1f1f1;padding: 13px;margin: 0px;font-size: 14px;"><span>Medicine Order</span><span style="padding-left:272px;">ID:' + (data.arhOrderId != undefined ? data.arhOrderId : "-") + '</span></h6>  ';
    medicine1 = '<table  style="margin:0px" >  ' +
      '               <tr style="border-bottom: 1pt solid rgb(209, 20, 20);">  ' +
      '                   <th style="text-align: left; background-color:#e4e4e4;width:180px;padding-left:13px;margin:0px">Item details</th>  ' +
      '                   <th style="text-align: left; background-color:#e4e4e4;width:180px;padding:4px;margin:0px">Qty</th>  ' +
      '                   <th style="text-align: left; background-color:#e4e4e4;width:180px;padding:4px;margin:0px">Price(Rs.)</th>  ' +
      '               </tr>  ';
    medicine2 = "</table>"
    let medicineTotal = 0;
    if (data.medicinePrescription) {
      for (let i = 0; i < data.medicinePrescription.length; i++) {
        medicine1 = medicine1 + "<tr><td style='border-bottom: 1px solid black;padding-left:13px;width:180px'>" + data.medicinePrescription[i].nameOfTheDrug + "</td>" + "<td  style='border-bottom: 1px solid black;width:180px'>" + data.medicinePrescription[i].numberOfUnits + "</td><td  style='border-bottom: 1px solid black;width:180px'>Rs." + Number((data.medicinePrescription[i].MRP * data.medicinePrescription[i].numberOfUnits)).toFixed(2) + "</td></tr>";
        medicineTotal = medicineTotal + Number((data.medicinePrescription[i].MRP * data.medicinePrescription[i].numberOfUnits));
      }
    }
    medicine3 = "<tr><td style='padding-left:13px;width:180px'> </td>" + "<td  style='border-bottom: 1px solid black;width:180px'>" + "Sum: " + "</td><td  style='border-bottom: 1px solid black;width:180px'>Rs." + Number(medicineTotal).toFixed(2) + "</td></tr>";
    medicine4 = "<tr><td style='padding-left:13px;width:180px'> </td>" + "<td  style='border-bottom: 1px solid black;width:180px'>" + "Shipping Charges: " + "</td><td  style='border-bottom: 1px solid black;width:180px'>Rs." + Number(data.shippingChargesInINR).toFixed(2) + "</td></tr>";
    medicine5 = "<tr><td style='padding-left:13px;width:180px'> </td>" + "<td  style='border-bottom: 1px solid black;width:180px'>" + "Discount: (" + data.discountOnMedicineInPercentage + "%)</td><td  style='border-bottom: 1px solid black;width:180px'>Rs." + (Number(medicineTotal) * Number(data.discountOnMedicineInPercentage) / 100) + "</td></tr>";
    medicine6 = "<tr><td style='padding-left:13px;width:180px'> </td>" + "<td  style='border-bottom: 1px solid black;width:180px'>" + "Total: " + "</td><td  style='border-bottom: 1px solid black;width:180px'>Rs." + Number(data.medicineTotalAmountInINR + data.shippingChargesInINR).toFixed(2) + "</td></tr>";




    //  medicine3 = '<p style="height: 20px;padding-left: 20px;margin:0"><span style="padding-left: 170px;font-weight: bold;" >Sum :</span><span style="padding-left: 161px;font-weight: bold;">Rs.' + Number(medicineTotal).toFixed(2) + '</span></p>  ';
    //  medicine4 = '<p style="height: 20px;padding-left: 20px;margin:0"><span style="margin:170px"><span style="font-weight: bold;" >Shipping Charges :</span><span style="padding-left: 79px;font-weight: bold;">Rs.' + Number(data.shippingChargesInINR).toFixed(2) + '</span></p>';
    //  medicine5 = '<p style="height: 20px;padding-left: 20px;margin:5"><span style="padding-left: 170px;font-weight: bold;" >Total :</span><span style="padding-left: 132px;font-weight: bold;">Rs.' + Number(data.medicineTotalAmountInINR + data.shippingChargesInINR).toFixed(2) + '</span></p>';
    //  medicine6 = '<p style="height: 20px;padding-left: 20px;margin:0"><span style="padding-left: 170px;font-weight: bold;" >Discount :</span><span style="padding-left: 156px;font-weight: bold;">' + data.discountOnMedicineInPercentage + '%</span></p>';
  }

  if (Number(data.diagnosticTestTotalAmountInINR) > 0) {
    lab1 = '<h6 style="background-color:#24347c;height: 100%;width:560px;color: #f1f1f1;padding: 13px;margin: 0px;font-size: 14px;"><span>Lab Test Order</span><span style=";padding-left:272px;">ID:' + (data.arhOrderId != undefined ? data.arhOrderId : "-") + '</span></h6>'
    lab2 = '    <table  style="margin:0" >  ' +
      '               <tr style="border-bottom: 1pt solid rgb(209, 20, 20);">  ' +
      '                   <th colspan="2" style="text-align: left; background-color:#e4e4e4;width:180px;padding-left:13px;margin:0px">Item details</th>  ' +
      '                   <th style="text-align: left; background-color:#e4e4e4;width:199px;padding:4px">Price(Rs.)</th>  ' +
      '               </tr>  ';

    lab3 = "</table>";
    let labTotal = 0;

    if (data.testPrescription) {
      for (let i = 0; i < data.testPrescription.length; i++) {
        lab2 = lab2 + "<tr><td colspan='2' style='border-bottom: 1px solid black;padding-left:13px;width:180px;'>" + data.testPrescription[i].serviceType + "</td>" + "</td><td  style='border-bottom: 1px solid black;width:180px;'>Rs." + Number(data.testPrescription[i].cost).toFixed(2) + "</td></tr>";
        labTotal = labTotal + Number(data.testPrescription[i].cost);
      }
    }
    lab4 = "<tr><td style='padding-left:13px;width:180px'> </td> <td  style='border-bottom: 1px solid black;width:180px'>Sum: </td> <td  style='border-bottom: 1px solid black;width:180px'>Rs." + Number(labTotal).toFixed(2) + "</td> </tr>"
    lab5 = "<tr><td style='padding-left:13px;width:180px'> </td> <td  style='border-bottom: 1px solid black;width:180px'>Home Collection Charges: </td> <td  style='border-bottom: 1px solid black;width:180px'>Rs." + Number(data.homeCollectionChargesInINR).toFixed(2) + "</td> </tr>"
    lab6 = "<tr><td style='padding-left:13px;width:180px'> </td> <td  style='border-bottom: 1px solid black;width:180px'>Additional Charges: </td> <td  style='border-bottom: 1px solid black;width:180px'>Rs." + Number(data.additionalHomeCollectionChargesInINR).toFixed(2) + "</td> </tr>"
    lab6 = "<tr><td style='padding-left:13px;border-bottom: 1px solid black;width:180px'> </td> <td  style='border-bottom: 1px solid black;width:180px'>Total: </td> <td  style='border-bottom: 1px solid black;width:180px'>Rs." + Number(data.diagnosticTestTotalAmountInINR + data.homeCollectionChargesInINR + data.additionalHomeCollectionChargesInINR).toFixed(2) + "</td> </tr>"


    //  lab4 = '<p style="height: 20px;padding-left: 20px;margin:0"><span style="padding-left: 170px;font-weight: bold;" >Sum :</span><span style="padding-left: 161px;font-weight: bold;">Rs.' + Number(labTotal).toFixed(2) + '</span></p>  ';
    //  lab5 = '<p style="height: 20px;padding-left: 20px;margin:0"><span style="margin:170px;font-weight: bold;"><span style="font-weight: bold;" >Home Collection Charges :</span><span style="padding-left: 32px;font-weight: bold;">Rs.' + Number(data.homeCollectionChargesInINR).toFixed(2) + '</span></p>';
    //  lab6 = '<p style="height: 20px;padding-left: 20px;margin:0"><span style="margin:170px;font-weight: bold;"><span style="font-weight: bold;" >Additional Charges :</span><span style="padding-left: 72px;font-weight: bold;">Rs.' + Number(data.additionalHomeCollectionChargesInINR).toFixed(2) + '</span></p>';
    //  lab7 = '<p style="height: 20px;padding-left: 20px;"><span style="padding-left: 170px;font-weight: bold;" >Total:</span><span style="padding-left: 160px;font-weight: bold;">Rs.' + Number(data.diagnosticTestTotalAmountInINR + data.homeCollectionChargesInINR + data.additionalHomeCollectionChargesInINR).toFixed(2) + '</span></p>';
  }
  if (Number(data.medicineTotalAmountInINR) > 0 || Number(data.diagnosticTestTotalAmountInINR) > 0) {
    // underline = '  <hr style="width:584px;margin: 0px;">  ';
    //  underline1 = '  <hr style="width:395px;margin: 0px;margin-left:190px;color:black">  ';

    let finalmedicineToal = data.medicineTotalAmountInINR + data.shippingChargesInINR;
    let finaldiagnosticTotal = data.diagnosticTestTotalAmountInINR + data.homeCollectionChargesInINR + data.additionalHomeCollectionChargesInINR;
    let finaltotal = data.medicineTotalAmountInINR + data.shippingChargesInINR + data.diagnosticTestTotalAmountInINR + data.homeCollectionChargesInINR + data.additionalHomeCollectionChargesInINR;

    maintotal = '<table>' +
      '<tr>' +
      '<td style="padding-left:13px;width:180px;"></td>' +
      '<td style="border-bottom: 1px solid black;width:180px;">Medicine Order:</td>' +
      '<td style="border-bottom: 1px solid black;width:199px;">Rs.' + Number(finalmedicineToal).toFixed(2) + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="padding-left:13px;border-bottom: 2px solid black;width:180px;">' +
      '</td>' +
      '<td style="border-bottom: 2px solid black;width:180px;">Lab Test Order:</td>' +
      '<td style="border-bottom: 2px solid black;width:199px;">Rs.' + Number(finaldiagnosticTotal).toFixed(2) + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="padding-left:13px;border-bottom: 3px solid black;width:180px;"></td>' +
      '<td style="border-bottom: 3px solid black;width:180px;"><strong>Final Total:</strong></td>' +
      '<td style="border-bottom: 3px solid black;width:199px;"><strong>Rs.' + Number(finaltotal).toFixed(2) + '</strong>' +
      '</td>' +
      '</tr>' +
      '</table>';
    //  maintotal =
    //   '               <p style="padding-left: 20px;font-weight:bold;margin:0" ><span style="font-weight:bold;padding-left:170px">Medicine Order:</span><span style="padding-left: 102px;">Rs.' + Number(finalmedicineToal).toFixed(2) + '<span></p>  ' +
    //   '               <p style="padding-left: 20px;font-weight:bold;margin:0"><span style="font-weight:bold;padding-left:170px">Lab Test:</span><span style="padding-left: 144px;">Rs.' + Number(finaldiagnosticTotal).toFixed(2) + '<span></p>  ' +
    //   underline1 +
    //   '                <p style="font-weight:bold;padding-left: 20px;margin:0"><span style="font-weight:bold;padding-left:170px">Final Total:</span><span style="padding-left: 132px;">Rs.' + Number(finaltotal).toFixed(2) + '<span></p>  ' +
    //   '<br>';

  }
  let gap = '<p></p>';
  let shippingaddress =
    '               <p style="font-weight: bold;padding-left: 20px;">Shipping Address</p>  ' +
    '               <p style="padding-left: 20px;margin:0">' + (data.deliveryAddress != undefined ? data.deliveryAddress : "-") + '</p>  ' +
    '               <p style="padding-left: 20px;margin:0">' + (data.city != undefined ? data.city : "-") + "," + (data.state != undefined ? data.state : "-") + '</p>  ' +
    '               <p style="padding-left: 20px;margin:0">' + (data.pincode != undefined ? data.pincode : "-") + '</p>  ' +
    '        <br>';

  let finalbody = `<p style="padding-left: 20px;">In case of any queries, feel free to reach out to us at mail us at <a href = "mailto: ${String(process.env.SYSTEM_RECEIVER_EMAIL_ID)}  style="text-decoration: none;color:blue;">${String(process.env.SYSTEM_RECEIVER_EMAIL_ID)}</a></p>  ` +
    '       <div style="font-weight: bold;padding-left: 20px;">  ' +
    '           <p style="margin:0px">Regards,</p>  ' +
    `          <p style="margin:0px>Team ${String(process.env.SYSTEM_SENDER_FULL_NAME)}</p>  ` +
    '       </div>  ' +
    '       <div style="font-weight: lighter;color: gray;font-size: 8px;padding-left: 20px;">  ' +
    `           <p>You are receiving this email because you are registered on the ${String(process.env.SYSTEM_SENDER_FULL_NAME)} app.This email is </p>  ` +
    '           <p>meant to communicate about your appointment/care and is not meant for promotional purposes.</p>  ' +
    '      </div>  ';
  let senddata = "";
  if (Number(data.diagnosticTestTotalAmountInINR) > 0 && Number(data.medicineTotalAmountInINR) == 0)
    senddata = mainbody + lab1 + lab2 + lab4 + lab5 + lab6 + lab7 + lab3 + shippingaddress + gap + finalbody;
  else if (Number(data.medicineTotalAmountInINR) > 0 && Number(data.diagnosticTestTotalAmountInINR) == 0)
    senddata = mainbody + medicine + medicine1 + medicine3 + medicine4 + medicine5 + medicine6 + medicine2 + shippingaddress + gap + finalbody;
  else
    senddata = mainbody + medicine + medicine1 + medicine3 + medicine4 + medicine5 + medicine6 + medicine2 + lab1 + lab2 + lab4 + lab5 + lab6 + lab7 + lab3 + maintotal + gap + shippingaddress + finalbody;

  return senddata

}

