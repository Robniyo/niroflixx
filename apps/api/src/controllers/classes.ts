import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

const cleanData = (data: any) => {
  const cleaned: any = {};
  for (const key of Object.keys(data)) {
    if (data[key] === '' || data[key] === null || data[key] === undefined) {
      continue;
    }
    if (['startDate', 'endDate', 'registrationDeadline'].includes(key)) {
      cleaned[key] = new Date(data[key]);
    } else if (key === 'capacity' || key === 'fee' || key === 'minStudents' || key === 'enrolledCount') {
      cleaned[key] = Number(data[key]);
    } else {
      cleaned[key] = data[key];
    }
  }
  return cleaned;
};

export const classesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const classes = await prisma.class.findMany({
        include: { course: { select: { title: true } }, trainer: { include: { user: { select: { firstName: true, lastName: true } } } } },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ status: 'success', data: classes });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const cls = await prisma.class.findUnique({
        where: { id: req.params.id },
        include: { course: true, trainer: { include: { user: { select: { firstName: true, lastName: true } } } }, sessions: true },
      });
      if (!cls) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: cls });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
  create: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const code = 'CLS-' + Date.now().toString().slice(-6);
      const cls = await prisma.class.create({ data: { ...data, code }, include: { course: { select: { title: true } } } });

      try {
        const users = await prisma.user.findMany({ select: { id: true } });
        if (users.length > 0) {
          await prisma.notification.createMany({
            data: users.map(u => ({
              userId: u.id, title: 'New Class Available!', message: `${req.body.name} is now open.`, link: `/academy`, type: 'CLASS',
            })),
          });
        }
      } catch (e) {}

      res.status(201).json({ status: 'success', data: cls });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  update: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const cls = await prisma.class.update({ where: { id: req.params.id }, data, include: { course: { select: { title: true } } } });
      res.json({ status: 'success', data: cls });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.class.update({ where: { id: req.params.id }, data: { status: 'CANCELLED' } });
      res.json({ status: 'success', message: 'Cancelled' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getCourses: async (_req: Request, res: Response) => {
    try {
      const courses = await prisma.course.findMany({ where: { status: 'PUBLISHED' }, select: { id: true, title: true } });
      res.json({ status: 'success', data: courses });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getTrainers: async (_req: Request, res: Response) => {
    try {
      const trainers = await prisma.trainer.findMany({ where: { status: 'ACTIVE' }, include: { user: { select: { firstName: true, lastName: true } } } });
      res.json({ status: 'success', data: trainers });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};