require("dotenv").config();
const { sendMail } = require("./ultils/mailer");

(async () => {
  try {
    const info = await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "Test email from Node.js",
      html: "<p>SMTP is working!</p>"
    });
    console.log("Mail sent:", info.messageId);
  } catch (err) {
    console.log(process.env.SMTP_USER, process.env.SMTP_PASS);
    console.error("Mail error:", err);
  }
})();
