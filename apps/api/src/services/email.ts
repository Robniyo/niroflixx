import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const branding = `
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #2563EB; margin-bottom: 24px;">
    <span style="font-size: 24px; font-weight: bold; color: #2563EB;">Niroflix</span>
  </div>
`;

const footer = `
  <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center;">
    <p style="color: #94A3B8; font-size: 12px; margin: 0 0 4px;">Niroflix — Learn, Grow, Succeed</p>
    <p style="color: #94A3B8; font-size: 12px; margin: 0 0 4px;">KG 11 Ave, Kigali, Rwanda</p>
    <p style="color: #94A3B8; font-size: 12px; margin: 0;">This email was sent because you have an account with Niroflix.</p>
  </div>
`;

export const emailService = {
  sendWelcome: async (to: string, name: string) => {
    try {
      await sgMail.send({
        to,
        from: { email: 'robertniyonkuru001@gmail.com', name: 'Niroflix' },
        subject: `Welcome to Niroflix, ${name}! 🚀`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px;">
            ${branding}
            <h2 style="color: #1E293B; margin: 0 0 12px;">Welcome, ${name}!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Your Niroflix account has been created successfully. You can now access digital courses, find opportunities, and request professional services.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://niroflixx.vercel.app/login" style="display: inline-block; padding: 14px 32px; background: #2563EB; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Go to Your Dashboard</a>
            </div>
            <p style="color: #64748B; font-size: 14px;">If you have any questions, reply to this email or contact us at <a href="mailto:robertniyonkuru001@gmail.com" style="color: #2563EB;">robertniyonkuru001@gmail.com</a>.</p>
            ${footer}
          </div>
        `,
      });
    } catch (e) { console.error('Welcome email failed:', e); }
  },

  sendPasswordReset: async (to: string, token: string) => {
    try {
      const resetUrl = `https://niroflixx.vercel.app/reset-password?token=${token}`;
      await sgMail.send({
        to,
        from: { email: 'robertniyonkuru001@gmail.com', name: 'Niroflix Security' },
        subject: 'Reset Your Niroflix Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px;">
            ${branding}
            <h2 style="color: #1E293B; margin: 0 0 12px;">Reset Your Password</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You requested a password reset for your Niroflix account. Click the button below to set a new password.</p>
            <p style="color: #94A3B8; font-size: 14px; margin: 0 0 24px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: #2563EB; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Reset Password</a>
            </div>
            <p style="color: #64748B; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #2563EB; font-size: 12px; word-break: break-all; margin: 8px 0 0;">${resetUrl}</p>
            ${footer}
          </div>
        `,
      });
    } catch (e) { console.error('Reset email failed:', e); }
  },

  sendEnrollmentConfirmation: async (to: string, name: string, courseName: string) => {
    try {
      await sgMail.send({
        to,
        from: { email: 'robertniyonkuru001@gmail.com', name: 'Niroflix Academy' },
        subject: `You're Enrolled: ${courseName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px;">
            ${branding}
            <h2 style="color: #1E293B; margin: 0 0 12px;">Enrollment Confirmed!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Hi ${name},</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">You've successfully enrolled in <strong style="color: #2563EB;">${courseName}</strong>. Your instructor will share class details soon.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://niroflixx.vercel.app/dashboard" style="display: inline-block; padding: 14px 32px; background: #2563EB; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">View My Courses</a>
            </div>
            ${footer}
          </div>
        `,
      });
    } catch (e) { console.error('Enrollment email failed:', e); }
  },
};