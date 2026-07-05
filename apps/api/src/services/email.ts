import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const emailService = {
  sendWelcome: async (to: string, name: string) => {
    try {
      await sgMail.send({
        to,
        from: 'robertniyonkuru001@gmail.com',
        subject: 'Welcome to Niroflix! 🚀',
        html: `<h1>Welcome, ${name}!</h1><p>Your account is ready. <a href="https://niroflixx.vercel.app/login">Login here</a></p>`,
      });
    } catch (e) { console.error('Welcome email failed:', e); }
  },

  sendPasswordReset: async (to: string, token: string) => {
    try {
      const resetUrl = `https://niroflixx.vercel.app/reset-password?token=${token}`;
      await sgMail.send({
        to,
        from: 'robertniyonkuru001@gmail.com',
        subject: 'Reset Your Password — Niroflix',
        html: `<h1>Reset Password</h1><p><a href="${resetUrl}">Click here to reset</a></p><p>Link expires in 1 hour.</p>`,
      });
    } catch (e) { console.error('Reset email failed:', e); }
  },

  sendEnrollmentConfirmation: async (to: string, name: string, courseName: string) => {
    try {
      await sgMail.send({
        to,
        from: 'robertniyonkuru001@gmail.com',
        subject: `Enrolled: ${courseName}`,
        html: `<h1>Enrolled!</h1><p>Hi ${name}, you're now enrolled in ${courseName}.</p>`,
      });
    } catch (e) { console.error('Enrollment email failed:', e); }
  },
};