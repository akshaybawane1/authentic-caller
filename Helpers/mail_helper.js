const nodemailer = require("nodemailer");

const sendEmail = async (
  mailTo,
  mailSubject,
  mailContent,
  smtpUrl,
  port,
  secure,
  username,
  password,
  tlsVersion
) => {
  const transporterObj = {
    host: smtpUrl || "smtp.gmail.com",
    port: port || 587,
    secure: secure || false,
    auth: {
      user: username || process.env.EMAIL_USERNAME,
      pass: password || process.env.EMAIL_PASSWORD,
    },
  };

  if (secure && tlsVersion) {
    transporterObj["tls"] = {
      ciphers: tlsVersion,
    };
  }
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport(transporterObj);

  const recipients = Array.isArray(mailTo) ? mailTo : [mailTo];

  // Send an email
  const mailOptions = {
    from: username,
    to: recipients.join(),
    subject: mailSubject,
    html: mailContent,
  };

  const response = await transporter.sendMail(mailOptions);
  return response;
};

module.exports = {
  sendEmail,
};
