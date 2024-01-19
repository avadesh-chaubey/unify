import Queue from 'bull';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import EmailTemp from 'email-templates';
import moment from 'moment';


Handlebars.registerPartial('header', fs.readFileSync(path.join(__dirname, '../templates/partials/header.hbs'), 'utf8'));
Handlebars.registerPartial('footer', fs.readFileSync(path.join(__dirname, '../templates/partials/footer.hbs'), 'utf8'));
import * as htmlPdf from 'html-pdf';
const { GcsFileUpload } = require('gcs-file-upload')

var nodemailer = require('nodemailer');
var sendgridTransport = require('nodemailer-sendgrid-transport');
const options = {
  auth: {
    api_key: process.env.EMAIL_DELIVERY_KEY
  }
}

const mailer = nodemailer.createTransport(sendgridTransport(options));

interface Payload {
  to: string;
  cc: string;
  bcc: string;
  from: string;
  subject: string;
  body: string;
  emailType: string;
  emailTemplate: string;
  emaiDeliveryType: string;
  atExactTime: Date;
  html: string;
}

const prescritionPDFUploadQueue = new Queue<Payload>('prescription:pdf:upload', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

prescritionPDFUploadQueue.process((job, done) => {
  //console.log("TestPrescription queue ");
  const object = JSON.parse(job.data.body);
  // fileName = "prescription.pdf";
  // filePath = path.join(__dirname, '../../templates/prescription.pdf');
  // fileCid = "";
  // try {
  generatehtmltopdf(object, job.data, job.data.html);
  //console.log("pdf done ");
  // } catch (error) {
  //   console.log(error);
  // }
  done();
});

async function generatehtmltopdf(datatoBind: any, job: Payload, html: string) {
  //console.log("inside generatehtmltopdf ");
  // fs.readFile(path.join(__dirname,'../templates/test-prescription.hbs'), 'utf8', function (err, data) {
  //   if (err) throw err;
  let datatogenerate = presciptionData(datatoBind);
  //var datatogenerate = doDataBinding(prescriptionData, datatoBind);
  //console.log("after doDataBinding " + datatogenerate);
  var options: any = {
    format: 'A4',
    orientation: 'portrait',
    phantomPath: '/usr/local/bin/phantomjs'
  };
  htmlPdf.create(datatogenerate, options).toBuffer(function (err: any, buffer: any) {
    if (err) return console.log(err);

    //console.log("pdf makeing done: ");
    const myBucket = new GcsFileUpload({
      keyFilename: "key.json",
      projectId: process.env.GCLOUD_PROJECT,
    }, process.env.GCS_BUCKET)

    const uploadPath = path.join("appointment", datatoBind.appointmentId + ".pdf");
    // console.log("path: " + uploadPath);
    const fileMetaData = {
      originalname: uploadPath,
      buffer: buffer
    }

    myBucket.uploadFile(fileMetaData)
      .then((data: any) => {
        //console.log(uploadPath + " backup file uploaded")
      })
      .catch((err: any) => {
        console.error(err)
      })
    //send email to patient 

    try {
      // console.log("to: "+data.to);
      // console.log("from: "+data.from);
      // console.log("content in email: "+content);
      // console.log("subject: "+data.subject);



      if (datatoBind.doctordetails2 === "Diabetologist") {
        var email = {
          to: job.to,
          cc: job.cc,
          from: job.from,
          subject: job.subject,
          html: html,
          attachments: [
            {
              content: buffer,
              filename: "prescription.pdf",
              type: "application/pdf",
              disposition: "attachment"
            }
          ]
        };

        mailer.sendMail(email, function (err: Error, res: Response) {
          if (err) {
            console.log(err)
          }
          console.log('mail sent to ' + email.to);

        });
      } else {
        var email2 = {
          to: job.to,
          cc: job.cc,
          bcc: job.bcc,
          from: job.from,
          subject: job.subject,
          html: html
        };

        mailer.sendMail(email2, function (err: Error, res: Response) {
          if (err) {
            console.log(err)
          }
          console.log('mail sent to ' + email2.to);

        });
      }

    } catch (error) {
      console.error(error);
    }

  });

  // });
}

function doDataBinding(data: string, databindings: any) {
  //console.log("inside doDataBinding ");
  for (var prop in databindings)
    if (databindings.hasOwnProperty(prop))
      data = data.split('{{' + prop + '}}').join(databindings[prop]);
  return data;
}
function presciptionData(data: any) {
  const currentTime = String(moment().utcOffset(330).format('DD-MM-YYYY, hh:mm A'));

  let body1 = '<div style="width: 100%; height: 180px;">' +
    '<div style="width: 20%; float: left;">' +
    '               <img src="data:image/png;base64,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" alt="Logo image" style="height:40px; margin: 30px 10px;"/>  ' +
    '</div>' +
    '<div style="width: 75%; float: right;margin-top: 20px;margin-right: 10px;">' +
    '  <div style="text-align: right; ">' +
    '                   <span style="font-size: 12px;">' + data.doctorName + '<br>  ' +
    '                   <span style="margin=0;font-size: 12px;">' + data.doctordetails1 + ',<br>  ' +
    '                   <span style="margin=0;font-weight: bold;font-size: 12px;">' + data.doctordetails2 + '</span><br>  ' +
    '                   <span  style="margin=0;font-size: 12px;">' + data.hospitalName + '<br>  ' +
    '                   <span  style="margin=0;font-size: 12px;">' + data.hospitaladd1 + '<br>  ' +
    '                   <span  style="margin=0;font-size: 12px;">' + data.hospitaladd2 + '<br>  ' +
    '               </div>  ' +
    '           </div>  ' +
    '       </div>  ' +
    '<table style ="width:100%:text-align:left;padding-left:20px">' +
    '           <tr style="height: 18px;font-size: 8px;">  ' +
    '                   <th style="text-align:left;width:200px;">MRD No  : <span style = "font-weight:normal"> ' + data.mdrNo + '</span></th><th style="text-align:left;width:200px">Date & Time:  <span style = "font-weight:normal">' + data.date + ' at ' + data.time + '</span></th><th style="text-align:left;width:200px">Consult Type:  <span style = "font-weight:normal">' + data.consultType + '</span></th>  ' +
    '           </tr>  ' +
    '           <tr style="height: 18px;font-weight: bold;font-size: 8px;">  ' +
    '                   <th style="text-align:left;width:200px">Patient Name :  <span style = "font-weight:normal">' + data.patientName + '</span></th><th style="text-align:left;width:200px">Age/ Gender:  <span style = "font-weight:normal">' + data.patientAge + '/' + data.patientGender + '</span></th><th style="text-align:left;width:200px">   <span style = "font-weight:normal">  </span></th> ' +
    '           </tr>  ' +
    '</table>' +
    '           <div style="height: 15px;padding-top:8px;width: 100%;font-weight: bold;padding-left: 20px;">  ' +
    '                   <span style="width: 33%;font-size: 10px;">Vitals </span>  ' +
    '           </div>  ' +
    '           <div style="height: 25px;width: 100%;padding-left: 20px;">  ' +
    '                   <span style="font-size: 8px;font-weight: bold;">Height </span>';
  if (data.heigthInCms) {
    body1 = body1 + '<span style="width: 33%;font-size: 8px;padding-left:10px;"> ' + data.heigthInCms + ' cms</span>';
  } else {
    body1 = body1 + '<span style="width: 33%;font-size: 8px;padding-left:10px;"> - </span>';
  }
  body1 = body1 + '<span style="padding-left:30px;font-size: 8px;font-weight: bold;">Weight </span>';
  if (data.weigthInKgs) {
    body1 = body1 + '<span style="width: 33%;padding-left:10px;font-size: 8px;">' + " " + data.weigthInKgs + ' Kg </span>';
  } else {
    body1 = body1 + '<span style="width: 33%;font-size: 8px;padding-left:10px;"> - </span>';
  }
  body1 = body1 + '<span style="padding-left:30px;font-size: 8px;font-weight: bold;">BMI </span>';
  if (data.bmi) {
    body1 = body1 + '<span style="width:33%;padding-left:10px;font-size: 8px;">' + data.bmi + ' kg/m</span><sup style="font-size: 6px;">' + 2 + '</sup> ';
  } else {
    body1 = body1 + '<span style="width: 33%;font-size: 8px;padding-left:10px;"> - </span>';
  }
  body1 = body1 + '                   <span style="font-size: 8px;font-weight: bold;padding-left:30px;">BP </span>';
  if (data.bloodPressureDiastolic) {
    body1 = body1 + '<span style="width: 33%;font-size: 8px;padding-left:10px;"> ' + data.bloodPressureDiastolic + ' mmHg</span>';
  } else {
    body1 = body1 + '<span style="width: 33%;font-size: 8px;padding-left:10px;"> - </span>';
  }
  body1 = body1 + '<span style="padding-left:30px;font-size: 8px;font-weight: bold;">Pulse </span>';
  if (data.pulse) {
    body1 = body1 + '<span style="width: 33%;padding-left:10px;font-size: 8px;">' + data.pulse + 'bpm</span>';
  } else {
    body1 = body1 + '<span style="width: 33%;font-size: 8px;padding-left:10px;"> - </span>';
  }
  body1 = body1 + '<span style="padding-left:30px;font-size: 8px;font-weight: bold;">Waist</span>';
  if (data.waistCircumference) {
    body1 = body1 + '<span style="width:33%;padding-left:10px;font-size: 8px;">' + data.waistCircumference + 'cms</span> ';
  } else {
    body1 = body1 + '<span style="width: 33%;font-size: 8px;padding-left:10px;"> - </span>';
  }
  body1 = body1 +
    '           </div>  ' +
    '           <div style="width: 100%;padding-left: 20px;"> <br> ' +
    '           <span style="font-style: italic;font-weight: bold;font-size: 8px;">Complaints:</span><span style="font-style: italic;font-size: 8px;padding-left:10px;">';
  if (data.chiefComplaints) {
    for (let i = 0; i < data.chiefComplaints.length; i++) {
      if (i === 0) {
        body1 = body1 + data.chiefComplaints[i].symptoms;
      } else {
        body1 = body1 + ", " + data.chiefComplaints[i].symptoms;
      }
    }
  } else {
    body1 = body1 + " - ";
  };
  body1 = body1 + '</span>  ' +
    '           </div>  ' +
    '           <div style="width: 100%;padding-left: 20px;padding-top:10px">  ' +
    '              <span style="font-style: italic;font-size: 8px;font-weight: bold;">Diagnosis:</span><span style="font-style: italic;font-size: 8px;padding-left:10px;">';

  if (data.diagnosis) {
    for (let i = 0; i < data.diagnosis.length; i++) {
      if (i === 0) {
        body1 = body1 + data.diagnosis[i];
      } else {
        body1 = body1 + ", " + data.diagnosis[i];
      }
    }
  } else {
    body1 = body1 + " - ";
  };
  body1 = body1 + '</span>  ' +
    '          </div>  ' +
    '            <br>';
  ;

  let tbody1 = '<table "padding-left: 20px"><thead><tr><th style="width=50px;font-size: 8px;border-bottom: 1px solid black">S.No</th><th style="width:200px;font-size: 8px;text-align:left;border-bottom: 1px solid black">Drug Type</th><th style="width:400px;font-size: 8px;text-align:left;border-bottom: 1px solid black">Drug Name</th><th style="width:200px;font-size: 8px;text-align:left;border-bottom: 1px solid black">Dose/Relation to Food</th><th style="width:100px;font-size: 8px;text-align:left;border-bottom: 1px solid black">Days</th><th style="width:300px;font-size: 8px;text-align:left;border-bottom: 1px solid black">Comments</th></tr></thead><tbody>';
  let tbody2 = "</tbody></table>"
  if (data.medicinelist) {
    for (let i = 0; i < data.medicinelist.length; i++) {
      let snumber = i + 1;
      tbody1 = tbody1 + '<tr><td style="width:50px;font-size: 8px;padding-left: 20px">' + snumber + '</td><td style="width:200px;font-size: 8px;">' + data.medicinelist[i].medicineType + '</td><td style="width:400px;font-size: 8px;">' + data.medicinelist[i].nameOfTheDrug + '</td><td style="width:200px;font-size: 8px; display:block"><span>' + data.medicinelist[i].intakeFrequency + '</span>' + '<span>[' + data.medicinelist[i].food + ']</span></td><td style="width:100px;font-size: 8px;">' + data.medicinelist[i].durationInDays + '</td><td style="width:300px;font-size: 8px;">' + data.medicinelist[i].otherNotes + "</td></tr>";
    }
  }
  let body2 = '   <br>' + '<div style="width: 100%;padding-left: 20px;">  ' +
    '               <p style="font-weight: bold;"><span style="font-style: italic;font-size: 8px;">Advice:';

  if (data.adviceInstruction) {
    for (let i = 0; i < data.adviceInstruction.length; i++) {
      body2 = body2 + ' <br> <span style="font-size: 8px;">' + data.adviceInstruction[i] + '</span>  ';
    }
  } else {
    body2 = body2 + " - ";
  };
  body2 = body2 + '</span></p>  ' +
    '           </div>  ' +
    '           <div style="width: 100%;padding-left: 20px;">  ' +
    '               <p style="font-weight: bold; display: inline;"><span style="font-style: italic;font-size: 8px;">Tests Prescribed:</span></p>';
  if (data.testPrescription) {
    for (let i = 0; i < data.testPrescription.length; i++) {
      body2 = body2 + ' <br> <span style="font-size: 8px;">' + data.testPrescription[i].serviceType + '</span>  ';
    }
  } else {
    body2 = body2 + " - ";
  }
  body2 = body2 +
    '           </div> <br> ' +
    '           <div style="width: 100%;padding-left: 20px;">  ' +
    '               <p style="font-weight: bold; display: inline;"><span style="font-style: italic;font-size: 8px;">Next Visit:</span></p>';
  if (data.nextVisit && data.nextVisit != 0 && data.nextVisit != undefined) {
    const nextVisit = data.nextVisit.split("-")[2] + "/" + data.nextVisit.split("-")[1] + "/" + data.nextVisit.split("-")[0];
    body2 = body2 + '<span style="font-size: 8px;padding-left: 10px;">' + nextVisit + '</span> ';

  }

  if (data.refferralconsultSpecialty && data.refferralconsultSpecialty != "" && data.refferralconsultSpecialty != undefined && data.refferralconsultSpecialty != "--Select--") {
    let reason = '';
    if (data.refferralReason && data.refferralReason != "") {
      reason = ' (Reason: ' + data.refferralReason + ')';
    }

    body2 = body2 +
      '           </div> <br> ' +
      '           <div style="width: 100%;padding-left: 20px;">  ' +
      '               <p style="font-weight: bold; display: inline;"><span style="font-style: italic;font-size: 8px;">Refer to:</span></p>';
    body2 = body2 + '<span style="font-size: 8px;padding-left: 10px;">' + data.refferralconsultSpecialty + reason + '</span> ';
  }
  let updateStr = '';
  if(data.isUpdatePdf === 'updated'){
    updateStr = ' (Last updated on '  + currentTime + ' )';
  }
  body2 = body2 +
    '          </div>';
  let body3 = '   <div style="width: 100%;margin-bottom: 10px;margin-top: 30px;padding-left: 20px;font-size: 8px;">  ' +
    '               <br>Prescribed on: ' + data.prescriptiondate  + updateStr + '  <br> <br>' +
    '               <br><style="font-weight: bold;">' + data.doctorName + ' ' +
    '               <br>' + data.doctordetails1 +
    '               <br>' + data.doctordetails2 + ' ' +
    '           </div>  '
  '            <br>';

  let body4 = '<div style="width: 100%;margin-bottom: 10px;padding-left: 20px;">  ' +
    '               <p style="color: gray;">  ' +
    '                   <span style="font-weight: bold;font-size: 8px;">Disclaimer:</span> <span style="font-size: 7px;"> This prescription is issued on the basis of your inputs during teleconsultation. It is valid from the date of issue until the specific period/dosage of each medicine as advised. </span>  ' +
    '               </p>  ' +
    '          </div>  '
  '           <br>';
  let body5 = '    <div style="width: 100%; height: 8px;border-bottom: 1px solid black;margin-top: 35px;"></div>  ' +
    '       <div style="width: 100%;">  ' +
    '           <p style="font-size: 7px; text-align: center;">To Reduce The dose of Tablet/Insulin if low sugar symptoms occur</p>  ' +
    '      </div>  ';
  return body1 + tbody1 + tbody2 + body2 + body3 + body4 + body5;;
}

export { prescritionPDFUploadQueue };
