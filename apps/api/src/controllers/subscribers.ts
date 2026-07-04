import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const subscribersController = {
  subscribe: async (req: Request, res: Response) => {
    try {
      const { name, email, phone, interests } = req.body;

      const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

      if (existing) {
        // Update interests
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { verified: true, active: true },
        });
      } else {
        await prisma.newsletterSubscriber.create({
          data: { email, verified: true, active: true },
        });
      }

      // Also save as contact message so admin sees it
      await prisma.contactMessage.create({
        data: {
          name: name || email,
          email,
          subject: `Notification Request — ${interests || 'All Opportunities'}`,
          message: `Name: ${name || 'N/A'}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nInterests: ${interests || 'All'}`,
        },
      });

      res.status(201).json({ status: 'success', message: 'You will be notified when opportunities are available.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Failed to subscribe', code: 500 });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const subscribers = await prisma.newsletterSubscriber.findMany({
        where: { active: true },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ status: 'success', data: subscribers });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch subscribers', code: 500 });
    }
  },
};