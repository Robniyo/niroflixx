import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const statsController = {
  getPublic: async (_req: Request, res: Response) => {
    try {
      const [courses, opportunities, users] = await Promise.all([
        prisma.course.count({ where: { status: 'PUBLISHED' } }),
        prisma.opportunity.count({ where: { status: 'PUBLISHED' } }),
        prisma.user.count(),
      ]);
      res.json({ status: 'success', data: { courses, opportunities, users } });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};