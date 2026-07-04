import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const contactController = {
  send: async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;
      await prisma.contactMessage.create({
        data: { name, email, subject, message },
      });
      res.status(201).json({ status: 'success', message: 'Message sent' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};