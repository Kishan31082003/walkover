const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function compileTemplate(templatePath, data) {
  const source = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(source);
  return template(data);
}

async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: `"Your Name" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = { compileTemplate, sendEmail };
