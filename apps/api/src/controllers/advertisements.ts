import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

const cleanData = (data: any) => {
  const cleaned: any = {};
  for (const key of Object.keys(data)) {
    if (data[key] === '' || data[key] === null || data[key] === undefined) continue;
    if (['views', 'clicks'].includes(key)) cleaned[key] = Number(data[key]);
    else if (['startDate', 'endDate'].includes(key) && data[key]) cleaned[key] = new Date(data[key]);
    else cleaned[key] = data[key];
  }
  return cleaned;
};

export const advertisementsController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const ads = await prisma.advertisement.findMany({ orderBy: { createdAt: 'desc' } });
      res.json({ status: 'success', data: ads });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const ad = await prisma.advertisement.findUnique({ where: { id: req.params.id } });
      if (!ad) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: ad });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  create: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const ad = await prisma.advertisement.create({ data });
      res.status(201).json({ status: 'success', data: ad });
    } catch (error) {
      console.error('AD CREATE ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const ad = await prisma.advertisement.update({ where: { id: req.params.id }, data });
      res.json({ status: 'success', data: ad });
    } catch (error) {
      console.error('AD UPDATE ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.advertisement.delete({ where: { id: req.params.id } });
      res.json({ status: 'success', message: 'Deleted' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};