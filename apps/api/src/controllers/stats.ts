import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const statsController = {
  getPublic: async (_req: Request, res: Response) => {
    try {
      const [
        courses,
        opportunities,
        users,
        resources,
        services,
        enrollments,
        servicesDelivered
      ] = await Promise.all([
        prisma.course.count({ where: { status: 'PUBLISHED' } }),
        prisma.opportunity.count({ where: { status: 'PUBLISHED' } }),
        prisma.user.count(),
        prisma.resource.count({ where: { status: 'PUBLISHED' } }),
        prisma.service.count({ where: { status: 'PUBLISHED' } }),
        prisma.enrollment.count(),
        prisma.serviceRequest.count({ where: { paymentStatus: 'PAID' } }),
      ]);

      res.json({
        status: 'success',
        data: {
          courses,
          opportunities,
          users,
          resources,
          services,
          enrollments,
          servicesDelivered,
        },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
};