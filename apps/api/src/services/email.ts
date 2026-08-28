import sgMail from '@sendgrid/mail';
import { prisma } from '../models/prisma';
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const branding = `
  <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #2563EB; margin-bottom: 24px;">
    <span style="font-size: 24px; font-weight: bold; color: #2563EB;">Future Scholars</span>
  </div>
`;

const footer = `
  <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center;">
    <p style="color: #94A3B8; font-size: 12px; margin: 0 0 4px;">Future Scholars — Learn, Grow, Succeed</p>
    <p style="color: #94A3B8; font-size: 12px; margin: 0 0 4px;">KG 11 Ave, Kigali, Rwanda</p>
    <p style="color: #94A3B8; font-size: 12px; margin: 0;">This email was sent because you have an account with Future Scholars.</p>
  </div>
`;

export const emailService = {
  sendWelcome: async (to: string, name: string) => {
    try {
      await sgMail.send({
        to,
        from: { email: 'robertniyonkuru001@gmail.com', name: 'Future Scholars' },
        subject: `Welcome to Future Scholars, ${name}! 🚀`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px;">
            ${branding}
            <h2 style="color: #1E293B; margin: 0 0 12px;">Welcome, ${name}!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Your Future Scholars account has been created successfully. You can now access digital courses, find opportunities, and request professional services.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://fscholars.online/login" style="display: inline-block; padding: 14px 32px; background: #2563EB; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Go to Your Dashboard</a>
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
      const resetUrl = `https://fscholars.online/reset-password?token=${token}`;
      await sgMail.send({
        to,
        from: { email: 'robertniyonkuru001@gmail.com', name: 'Future Scholars Security' },
        subject: 'Reset Your Future Scholars Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px;">
            ${branding}
            <h2 style="color: #1E293B; margin: 0 0 12px;">Reset Your Password</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">You requested a password reset for your Future Scholars account. Click the button below to set a new password.</p>
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
        from: { email: 'robertniyonkuru001@gmail.com', name: 'Future Scholars Academy' },
        subject: `You're Enrolled: ${courseName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px;">
            ${branding}
            <h2 style="color: #1E293B; margin: 0 0 12px;">Enrollment Confirmed!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Hi ${name},</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">You've successfully enrolled in <strong style="color: #2563EB;">${courseName}</strong>. Your instructor will share class details soon.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://fscholars.online/dashboard" style="display: inline-block; padding: 14px 32px; background: #2563EB; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">View My Courses</a>
            </div>
            ${footer}
          </div>
        `,
      });
    } catch (e) { console.error('Enrollment email failed:', e); }
  },

  sendServiceRequestConfirmation: async (to: string, name: string, serviceName: string, message: string) => {
    try {
      await sgMail.send({
        to,
        from: { email: 'robertniyonkuru001@gmail.com', name: 'Future Scholars Services' },
        subject: `Service Request Received: ${serviceName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px;">
            ${branding}
            <h2 style="color: #1E293B; margin: 0 0 12px;">Request Received!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 8px;">Hi ${name},</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">We've received your request for <strong style="color: #2563EB;">${serviceName}</strong>. Our team will review it and contact you within 24 hours.</p>
            <div style="background: #F1F5F9; padding: 16px; border-radius: 8px; margin: 0 0 24px;">
              <p style="color: #1E293B; font-size: 14px; margin: 0 0 4px;"><strong>Your Message:</strong></p>
              <p style="color: #475569; font-size: 14px; margin: 0;">${message || 'No details provided'}</p>
            </div>
            <p style="color: #64748B; font-size: 14px; margin: 0 0 24px;">If you have urgent questions, contact us at <a href="mailto:robertniyonkuru001@gmail.com" style="color: #2563EB;">robertniyonkuru001@gmail.com</a> or call <strong>+250 795 064 502</strong>.</p>
            ${footer}
          </div>
        `,
      });
    } catch (e) { console.error('Service request email failed:', e); }
  },

  sendApplicationStatus: async (to: string, name: string, status: string, opportunityTitle: string, adminNotes: string) => {
    try {
      const isApproved = status === 'APPROVED';
      const subject = isApproved
        ? `Your application for "${opportunityTitle}" has been approved!`
        : `Update on your application for "${opportunityTitle}"`;

      const bodyText = isApproved
        ? `Congratulations, ${name}! Your application for "${opportunityTitle}" has been approved. Our team will reach out to you with the next steps.`
        : `Dear ${name}, after careful review, your application for "${opportunityTitle}" was not selected at this time. We encourage you to keep applying and building your profile.`;

      await sgMail.send({
        to,
        from: { email: 'robertniyonkuru001@gmail.com', name: 'Future Scholars' },
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px;">
            ${branding}
            <h2 style="color: #1E293B; margin: 0 0 12px;">${isApproved ? 'Application Approved!' : 'Application Status Update'}</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">${bodyText}</p>
            <div style="background: #F1F5F9; padding: 16px; border-radius: 8px; margin: 0 0 24px;">
              <p style="color: #1E293B; font-size: 14px; margin: 0 0 4px;"><strong>Admin Notes:</strong></p>
              <p style="color: #475569; font-size: 14px; margin: 0;">${adminNotes || 'None'}</p>
            </div>
            <p style="color: #64748B; font-size: 14px;">If you have any questions, contact us at <a href="mailto:robertniyonkuru001@gmail.com" style="color: #2563EB;">robertniyonkuru001@gmail.com</a>.</p>
            ${footer}
          </div>
        `,
      });
    } catch (e) { console.error('Application status email failed:', e); }
  },
    sendEnrollmentPaymentConfirmation: async (to: string, name: string, courseId: string, amountPaid: number, remainingBalance: number) => {
    try {
      const course = await prisma.course.findUnique({ where: { id: courseId }, select: { title: true } });
      const courseName = course?.title || 'your course';

      await sgMail.send({
        to,
        from: { email: 'robertniyonkuru001@gmail.com', name: 'Future Scholars Academy' },
        subject: `Payment Received for ${courseName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px;">
            ${branding}
            <h2 style="color: #1E293B; margin: 0 0 12px;">Payment Received!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi ${name},</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Your payment of <strong>${amountPaid.toLocaleString()} RWF</strong> for <strong>${courseName}</strong> has been received.</p>
            <div style="background: #F1F5F9; padding: 16px; border-radius: 8px; margin: 0 0 24px;">
              <p style="color: #1E293B; font-size: 14px; margin: 0 0 4px;"><strong>Remaining Balance:</strong></p>
              <p style="color: #2563EB; font-size: 24px; font-weight: bold; margin: 0;">${remainingBalance.toLocaleString()} RWF</p>
            </div>
            <p style="color: #64748B; font-size: 14px;">Continue your learning journey! If you have any questions, contact us at <a href="mailto:robertniyonkuru001@gmail.com" style="color: #2563EB;">robertniyonkuru001@gmail.com</a>.</p>
            ${footer}
          </div>
        `,
      });
    } catch (e) { console.error('Enrollment payment email failed:', e); }
  },
    sendPaymentReminder: async (to: string, name: string, courseName: string, amountPaid: number, remaining: number, total: number) => {
    try {
      await sgMail.send({
        to,
        from: { email: 'robertniyonkuru001@gmail.com', name: 'Future Scholars Academy' },
        subject: `Payment Reminder for ${courseName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px;">
            ${branding}
            <h2 style="color: #1E293B; margin: 0 0 12px;">Payment Reminder</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi ${name},</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">This is a friendly reminder that you have an outstanding balance for <strong>${courseName}</strong>.</p>
            <div style="background: #F1F5F9; padding: 16px; border-radius: 8px; margin: 0 0 24px;">
              <p style="color: #1E293B; font-size: 14px; margin: 0 0 4px;"><strong>Total Amount:</strong> ${total.toLocaleString()} RWF</p>
              <p style="color: #1E293B; font-size: 14px; margin: 0 0 4px;"><strong>Amount Paid:</strong> ${amountPaid.toLocaleString()} RWF</p>
              <p style="color: #2563EB; font-size: 24px; font-weight: bold; margin: 0;">Remaining: ${remaining.toLocaleString()} RWF</p>
            </div>
            <p style="color: #64748B; font-size: 14px;">Please complete your payment to continue your learning journey. If you have already paid, please ignore this message.</p>
            ${footer}
          </div>
        `,
      });
    } catch (e) { console.error('Payment reminder email failed:', e); }
  },
};