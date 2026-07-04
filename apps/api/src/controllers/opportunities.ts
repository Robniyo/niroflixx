import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const opportunitiesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 12, type, status, country, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (type) where.type = type;
      if (status) where.status = status;
      if (country) where.country = country;
      if (search) where.title = { contains: search as string };

      const [opportunities, total] = await Promise.all([
        prisma.opportunity.findMany({
          where,
          include: { category: true },
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
        }),
        prisma.opportunity.count({ where }),
      ]);

      res.json({
        status: 'success',
        data: opportunities,
        pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch opportunities', code: 500 });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const opportunity = await prisma.opportunity.findUnique({
        where: { id: req.params.id },
        include: { category: true, tags: true },
      });
      if (!opportunity) return res.status(404).json({ status: 'error', message: 'Opportunity not found', code: 404 });
      res.json({ status: 'success', data: opportunity });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch opportunity', code: 500 });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const data: any = { ...req.body };
      if (data.deadline && data.deadline !== '') {
        data.deadline = new Date(data.deadline);
      } else {
        delete data.deadline;
      }
      const opportunity = await prisma.opportunity.create({ data });

      // Notify all users
      try {
        const users = await prisma.user.findMany({ select: { id: true } });
        if (users.length > 0) {
          await prisma.notification.createMany({
            data: users.map(u => ({
              userId: u.id,
              title: 'New Opportunity!',
              message: `${req.body.title} has been posted. Apply now!`,
              link: `/opportunities/${opportunity.id}`,
              type: 'OPPORTUNITY',
            })),
          });
        }
      } catch (e) {}

      res.status(201).json({ status: 'success', message: 'Opportunity created', data: opportunity });
    } catch (error) {
      console.error('OPPORTUNITY CREATE ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Failed to create opportunity', code: 500 });
    }
  }, 
  

  update: async (req: Request, res: Response) => {
    try {
      const data: any = { ...req.body };
      if (data.deadline && data.deadline !== '') {
        data.deadline = new Date(data.deadline);
      } else {
        delete data.deadline;
      }
      const opportunity = await prisma.opportunity.update({ where: { id: req.params.id }, data });
      res.json({ status: 'success', message: 'Opportunity updated', data: opportunity });
    } catch (error) {
      console.error('OPPORTUNITY UPDATE ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Failed to update opportunity', code: 500 });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.opportunity.update({ where: { id: req.params.id }, data: { status: 'ARCHIVED' } });
      res.json({ status: 'success', message: 'Opportunity archived' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to delete opportunity', code: 500 });
    }
  },
};