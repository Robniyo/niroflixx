import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const attendanceController = {
  getByClass: async (req: Request, res: Response) => {
    try {
      const attendance = await prisma.attendance.findMany({
        where: { classId: req.params.classId },
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { date: 'desc' },
      });
      res.json({ status: 'success', data: attendance });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  mark: async (req: Request, res: Response) => {
    try {
      const { classId, userId, status, date, notes } = req.body;
      const record = await prisma.attendance.upsert({
        where: { classId_userId_date: { classId, userId, date: new Date(date) } },
        update: { status, notes },
        create: { classId, userId, status, date: new Date(date), notes },
      });
      res.json({ status: 'success', data: record });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
};