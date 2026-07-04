import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

const cleanData = (data: any) => {
  const cleaned: any = {};
  for (const key of Object.keys(data)) {
    if (data[key] === '' || data[key] === null || data[key] === undefined) continue;
    if (['startingPrice'].includes(key)) cleaned[key] = Number(data[key]);
    else cleaned[key] = data[key];
  }
  return cleaned;
};

export const servicesController = {
getAll: async (req: Request, res: Response) => {
    try {
      const services = await prisma.service.findMany({ 
        where: { status: 'PUBLISHED' }, 
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ status: 'success', data: services });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getBySlug: async (req: Request, res: Response) => {
    try {
      const service = await prisma.service.findUnique({ where: { slug: req.params.slug }, include: { category: true } });
      if (!service) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: service });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const service = await prisma.service.findUnique({ where: { id: req.params.id } });
      if (!service) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: service });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
  create: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const slug = data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4) : 'service-' + Date.now();
      const service = await prisma.service.create({ data: { ...data, slug } });

      try {
        const users = await prisma.user.findMany({ select: { id: true } });
        if (users.length > 0) {
          await prisma.notification.createMany({
            data: users.map(u => ({
              userId: u.id, title: 'New Service!', message: `${req.body.title} — Check it out!`, link: `/services`, type: 'SERVICE',
            })),
          });
        }
      } catch (e) {}

      res.status(201).json({ status: 'success', data: service });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  update: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const service = await prisma.service.update({ where: { id: req.params.id }, data });
      res.json({ status: 'success', data: service });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.service.update({ where: { id: req.params.id }, data: { status: 'ARCHIVED' } });
      res.json({ status: 'success', message: 'Archived' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
  requestService: async (req: Request, res: Response) => {
    try {
      const { serviceId, description, name, email, phone } = req.body;
      
      // Save contact message for admin
      await prisma.contactMessage.create({
        data: {
          name,
          email,
          subject: `Service Request: ${serviceId}`,
          message: `Phone: ${phone || 'N/A'}\n\n${description || 'No details provided'}`,
        },
      });

      res.status(201).json({ status: 'success', message: 'Request sent!' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};