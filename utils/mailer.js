const nodemailer = require('nodemailer');

const sendMail = async options => {
  // create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 465,
    auth: {
      user: '19d61131a282c1',
      pass: '472e9d337fef72'
    }
  });

  // configure options
  const mailOptions = {
    from: 'Natours Agency <hello@jonas.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html
  };

  // send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
