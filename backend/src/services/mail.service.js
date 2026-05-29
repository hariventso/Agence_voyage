const nodemailer = require('nodemailer');

const config = require('../config/env');

const transporter = config.smtp.configured
  ? nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    })
  : null;

const sendMail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.log(`[Mail] SMTP non configuré. Envoi simulé pour ${to}: ${subject}`);
    return { simulated: true, recipient: to };
  }

  await transporter.sendMail({
    from: config.smtp.from,
    to,
    subject,
    text,
    html,
  });

  return { simulated: false, recipient: to };
};

module.exports = {
  sendMail,
  smtpConfigured: config.smtp.configured,
};
