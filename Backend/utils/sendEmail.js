// sendEmail.js
const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sendEmail
 * @param {string} toEmail - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} message - HTML content of the email
 */
const sendEmail = async (toEmail, subject, message) => {
  try {
    const msg = {
      to: toEmail,
      from: "rahuljnv669@gmail.com", // Must be verified in SendGrid
      subject,
      html: message,
    };

    await sgMail.send(msg);
    console.log("Email sent successfully to", toEmail);
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error.message);
    throw error;
  }
};

module.exports = sendEmail;
