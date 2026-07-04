import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const trainersController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const trainers = await prisma.trainer.findMany({
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ status: 'success', data: trainers });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, phone, bio, skills, experience } = req.body;
      
      // Create user first
      const bcrypt = require('bcryptjs');
      const password = await bcrypt.hash('trainer123', 12);
      
      const user = await prisma.user.create({
        data: {
          firstName, lastName, email, phone: phone || '',
          username: email.split('@')[0],
          password,
          role: 'INSTRUCTOR',
          status: 'ACTIVE',
          emailVerified: true,
          profile: { create: {} },
        },
      });

      const trainer = await prisma.trainer.create({
        data: { userId: user.id, bio, skills, experience },
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      });

      res.status(201).json({ status: 'success', message: 'Trainer created', data: trainer });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Failed to create trainer', code: 500 });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { bio, skills, experience, status } = req.body;
      const trainer = await prisma.trainer.update({
        where: { id: req.params.id },
        data: { bio, skills, experience, status },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      });
      res.json({ status: 'success', data: trainer });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.trainer.update({ where: { id: req.params.id }, data: { status: 'INACTIVE' } });
      res.json({ status: 'success', message: 'Trainer deactivated' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
};