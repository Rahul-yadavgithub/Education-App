export const verifyEmailTemplate = (verifyUrl, name) => {
  return `
  <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
    <h2 style="color: #1a73e8;">Hello ${name},</h2>
    <p>Thank you for signing up! Please verify your email by clicking the button below:</p>
    <a href="${verifyUrl}" 
       style="display: inline-block; padding: 12px 24px; background-color: #1a73e8; color: #fff; font-weight: bold; text-decoration: none; border-radius: 6px; margin-top: 20px;">
       Verify My Email
    </a>
    <p style="margin-top: 20px; font-size: 12px; color: #555;">
      If you did not sign up, please ignore this email.
    </p>
  </div>
  `;
};
