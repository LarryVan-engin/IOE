// utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: (process.env.SMTP_SECURE === "true"), // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendMail({ to, subject, html, text }) {
  const info = await transporter.sendMail({
    from: `"No-Reply" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html
  });
  return info;
}

module.exports = { sendMail };
