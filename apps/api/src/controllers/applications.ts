import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

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
      res.json({ status: 'success', data: application });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name, email, phone, message, opportunityId } = req.body;
      
      const application = await prisma.application.create({
        data: {
          opportunityId,
          status: 'SUBMITTED',
          documents: JSON.stringify({ name, email, phone, message }),
        },
      });
      
      await prisma.contactMessage.create({
        data: {
          name: name || 'Applicant',
          email: email || 'no-email',
          subject: `New Application: ${opportunityId}`,
          message: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage: ${message || 'No message'}`,
        },
      });

      res.status(201).json({ status: 'success', data: application });
    } catch (error) { 
      console.error('APPLICATION CREATE ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); 
    }
  },
};