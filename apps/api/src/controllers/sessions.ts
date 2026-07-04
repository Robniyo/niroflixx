import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

const cleanData = (data: any) => {
  const cleaned: any = {};
  for (const key of Object.keys(data)) {
    if (data[key] === '' || data[key] === null || data[key] === undefined) continue;
    if (['startDate', 'endDate', 'registrationDeadline'].includes(key)) cleaned[key] = new Date(data[key]);
    else if (['capacity', 'price'].includes(key)) cleaned[key] = Number(data[key]);
    else cleaned[key] = data[key];
  }
  return cleaned;
};

export const sessionsController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const sessions = await prisma.classSession.findMany({
        include: { class: { select: { name: true } }, trainer: { include: { user: { select: { firstName: true, lastName: true } } } } },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ status: 'success', data: sessions });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const session = await prisma.classSession.findUnique({
        where: { id: req.params.id },
        include: { class: { select: { name: true } } },
      });
      if (!session) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: session });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  create: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const session = await prisma.classSession.create({ data });
      res.status(201).json({ status: 'success', data: session });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  update: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const session = await prisma.classSession.update({ where: { id: req.params.id }, data });
      res.json({ status: 'success', data: session });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.classSession.delete({ where: { id: req.params.id } });
      res.json({ status: 'success', message: 'Deleted' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};