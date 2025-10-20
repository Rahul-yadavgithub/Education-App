import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (toEmail, subject, message) => {
  try {
    const msg = {
      to: toEmail, // Recipient email
      from: "rahuljnv669@gmail.com", // Verified sender email in SendGrid
      subject: subject,
      html: message, // HTML content
    };

    await sgMail.send(msg);
    console.log("Email sent successfully to", toEmail);
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error.message);
    throw error;
  }
};

export default sendEmail;
