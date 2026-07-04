import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const categoriesController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
      res.json({ status: 'success', data: categories });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  create: async (req: Request, res: Response) => {
    try {
      const name = req.body.name;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const cat = await prisma.category.create({ data: { name, slug } });
      res.status(201).json({ status: 'success', data: cat });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.category.delete({ where: { id: req.params.id } });
      res.json({ status: 'success', message: 'Deleted' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};