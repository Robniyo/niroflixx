import { Request, Response } from 'express';
import { prisma } from '../models/prisma';
import { emailService } from '../services/email';

export const applicationsController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const applications = await prisma.application.findMany({
        include: {
          candidate: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
          opportunity: { select: { title: true, type: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ status: 'success', data: applications });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { status, reviewNotes, adminNotes } = req.body;
      const application = await prisma.application.update({
        where: { id: req.params.id },
        data: { status, reviewNotes, adminNotes },
      });

      // Parse applicant contact info from the stored documents JSON
      let applicantEmail = '';
      let applicantName = '';
      try {
        const docs = application.documents ? JSON.parse(application.documents) : {};
        applicantEmail = docs.email || '';
        applicantName = docs.name || 'Applicant';
      } catch {}

      // Send email notification about status change
      if (applicantEmail && status) {
        const subject =
          status === 'APPROVED'
            ? `Your application has been approved`
            : `Update on your application`;
        const message =
          status === 'APPROVED'
            ? `Dear ${applicantName},\n\nWe're happy to inform you that your application has been approved. Our team will reach out to you with further steps.\n\nAdmin notes: ${adminNotes || 'None'}\n\n— Future Scholars Team`
            : `Dear ${applicantName},\n\nAfter careful review, your application was not selected at this time. We encourage you to keep applying and building your profile.\n\nAdmin notes: ${adminNotes || 'None'}\n\n— Future Scholars Team`;

        emailService
          .sendGeneric(applicantEmail, subject, message)
          .catch((e) => console.error('Email notification failed:', e));
      }

      res.json({ status: 'success', data: application });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name, email, phone, message, opportunityId } = req.body;
      const userId = (req as any).userId;

      const data: any = {
        opportunityId,
        status: 'SUBMITTED',
        documents: JSON.stringify({ name, email, phone, message }),
      };

      if (userId) {
        data.userId = userId;
        const candidate = await prisma.candidate.findUnique({ where: { userId } });
        if (candidate) {
          data.candidateId = candidate.id;
        }
      }

      const application = await prisma.application.create({ data });

      await prisma.contactMessage.create({
        data: {
          name: name || 'Applicant',
          email: email || 'no-email',
          subject: `New Application: ${opportunityId}`,
          message: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage: ${message || 'No message'}\n\nCandidate: ${data.candidateId ? 'Linked' : 'Not linked'}`,
        },
      });

      res.status(201).json({ status: 'success', data: application });
    } catch (error) {
      console.error('APPLICATION CREATE ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
};