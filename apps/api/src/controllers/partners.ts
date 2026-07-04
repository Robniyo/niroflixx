import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const partnersController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const partners = await prisma.partner.findMany({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } });
      res.json({ status: 'success', data: partners });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const p = await prisma.partner.findUnique({ where: { id: req.params.id } });
      if (!p) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: p });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  create: async (req: Request, res: Response) => {
    try {
      const p = await prisma.partner.create({ data: req.body });
      res.status(201).json({ status: 'success', data: p });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const p = await prisma.partner.update({ where: { id: req.params.id }, data: req.body });
      res.json({ status: 'success', data: p });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.partner.update({ where: { id: req.params.id }, data: { status: 'INACTIVE' } });
      res.json({ status: 'success', message: 'Removed' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
};