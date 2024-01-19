import Queue from 'bull';

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
  Cc: string;
  Bcc: string;
  from: string;
  subject: string;
  body: string;

}

const sendNewEmailQueue = new Queue<Payload>('email:delivery:service', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

sendNewEmailQueue.process((job, done) => {

  var email = {
    to: job.data.to,
    cc: job.data.Cc,
    bcc: job.data.Bcc,
    from: job.data.from,
    subject: job.data.subject,
    html: job.data.body,
  };

  //console.log(job.data);
  mailer.sendMail(email, function (err: Error, res: Response) {
    if (err) {
      console.log(err)
    }
    console.log(new Date() + ' mail sent to ' + email.to);
  });
  done();

});

export { sendNewEmailQueue };
