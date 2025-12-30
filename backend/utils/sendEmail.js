// backend/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // Use Mailtrap credentials (replace with your own)
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "09790583455a25", // From Mailtrap SMTP
      pass: "9de38ea2200114", // From Mailtrap SMTP
    },
  });

  const info = await transporter.sendMail({
    from: '"LARRYSMS" <no-reply@larrrysms.com>',
    to,
    subject,
    text,
    // html: "<p>Click <a href='" + link + "'>here</a> to reset</p>", // Optional HTML
  });

  console.log("Email sent successfully!");
  console.log("Message ID:", info.messageId);
};

module.exports = sendEmail;