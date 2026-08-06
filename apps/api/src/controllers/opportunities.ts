import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

// Helper to compute status dynamically from deadline
function getComputedStatus(deadline: Date | string | null): 'OPEN' | 'CLOSING_SOON' | 'CLOSED' {
  if (!deadline) return 'OPEN';
  const now = new Date();
  const d = new Date(deadline);
  if (d < now) return 'CLOSED';
  const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  if (d <= threeDays) return 'CLOSING_SOON';
  return 'OPEN';
}

export const opportunitiesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        limit = 12,
        type,
        status,
        country,
        search,
        educationLevel,
        computedStatus,
      } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (type) where.type = type;
      if (status) where.status = status;
      if (country) where.country = country;
      if (educationLevel) where.educationLevel = educationLevel;
      if (search) where.title = { contains: search as string };

      // Fetch all matching opportunities (no limit first, because we might need to filter by computedStatus)
      let [allOpportunities, total] = await Promise.all([
        prisma.opportunity.findMany({
          where,
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.opportunity.count({ where }),
      ]);

      // Add computed status to each
      let data = allOpportunities.map(opp => ({
        ...opp,
        computedStatus: getComputedStatus(opp.deadline),
      }));

      // If computedStatus filter is provided, apply it
      if (computedStatus) {
        data = data.filter(opp => opp.computedStatus === computedStatus);
        total = data.length; // new total after filtering
      }

      // Apply pagination after filtering
      const paginatedData = data.slice(skip, skip + Number(limit));

      res.json({
        status: 'success',
        data: paginatedData,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
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
      if (!opportunity)
        return res.status(404).json({ status: 'error', message: 'Opportunity not found', code: 404 });

      res.json({
        status: 'success',
        data: {
          ...opportunity,
          computedStatus: getComputedStatus(opportunity.deadline),
        },
      });
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