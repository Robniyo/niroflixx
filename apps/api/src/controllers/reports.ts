import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const reportsController = {
  getClassAttendance: async (req: Request, res: Response) => {
    try {
      const { classId } = req.params;
      const { date } = req.query;

      const where: any = { classId };
      if (date) {
        where.date = {
          gte: new Date(date as string),
          lt: new Date(new Date(date as string).getTime() + 86400000),
        };
      }

      const attendance = await prisma.attendance.findMany({
        where,
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        orderBy: [{ date: 'desc' }, { user: { firstName: 'asc' } }],
      });

      const grouped: any = {};
      attendance.forEach(a => {
        const d = a.date.toISOString().split('T')[0];
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push(a);
      });

      const total = attendance.length;
      const present = attendance.filter(a => a.status === 'PRESENT').length;
      const absent = attendance.filter(a => a.status === 'ABSENT').length;
      const late = attendance.filter(a => a.status === 'LATE').length;

      res.json({
        status: 'success',
        data: attendance,
        grouped,
        summary: { total, present, absent, late },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  getAllAttendance: async (req: Request, res: Response) => {
    try {
      const { date, trainerId } = req.query;
      const where: any = {};

      if (date) {
        where.date = {
          gte: new Date(date as string),
          lt: new Date(new Date(date as string).getTime() + 86400000),
        };
      }

      if (trainerId) {
        where.class = { trainerId: trainerId as string };
      }

      const attendance = await prisma.attendance.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          class: { select: { id: true, name: true, trainer: { include: { user: { select: { firstName: true, lastName: true } } } } } },
        },
        orderBy: [{ date: 'desc' }, { class: { name: 'asc' } }],
      });

      const grouped: any = {};
      attendance.forEach(a => {
        const className = a.class?.name || 'Unknown';
        const d = a.date.toISOString().split('T')[0];
        if (!grouped[className]) grouped[className] = {};
        if (!grouped[className][d]) grouped[className][d] = [];
        grouped[className][d].push(a);
      });

      const total = attendance.length;
      const present = attendance.filter(a => a.status === 'PRESENT').length;
      const absent = attendance.filter(a => a.status === 'ABSENT').length;
      const late = attendance.filter(a => a.status === 'LATE').length;

      res.json({
        status: 'success',
        data: attendance,
        grouped,
        summary: { total, present, absent, late },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
};