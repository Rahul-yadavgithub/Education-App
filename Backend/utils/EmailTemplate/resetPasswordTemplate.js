export const resetPasswordTemplate = (resetUrl, name) => {
  return `
  <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
    <h2 style="color: #1a73e8;">Hello ${name},</h2>
    <p>You requested to reset your password. Click the button below to reset it:</p>
    <a href="${resetUrl}" 
       style="display: inline-block; padding: 12px 24px; background-color: #1a73e8; color: #fff; font-weight: bold; text-decoration: none; border-radius: 6px; margin-top: 20px;">
       Reset Password
    </a>
    <p style="margin-top: 20px; font-size: 12px; color: #555;">
      If you did not request a password reset, please ignore this email.
    </p>
  </div>
  `;
};
