import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const testimonialsController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
      res.json({ status: 'success', data: testimonials });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  getPublished: async (_req: Request, res: Response) => {
    try {
      const testimonials = await prisma.testimonial.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' } });
      res.json({ status: 'success', data: testimonials });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const t = await prisma.testimonial.findUnique({ where: { id: req.params.id } });
      if (!t) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: t });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  create: async (req: Request, res: Response) => {
    try {
      const t = await prisma.testimonial.create({ data: req.body });
      res.status(201).json({ status: 'success', data: t });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const t = await prisma.testimonial.update({ where: { id: req.params.id }, data: req.body });
      res.json({ status: 'success', data: t });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.testimonial.delete({ where: { id: req.params.id } });
      res.json({ status: 'success', message: 'Deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
};