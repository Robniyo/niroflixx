import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

const cleanData = (data: any) => {
  const cleaned: any = {};
  for (const key of Object.keys(data)) {
    if (data[key] === '' || data[key] === null || data[key] === undefined) continue;
    cleaned[key] = data[key];
  }
  return cleaned;
};

export const newsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 12, status, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const where: any = {};
      if (status) where.status = status;
      if (search) where.title = { contains: search as string };
      const [news, total] = await Promise.all([
        prisma.news.findMany({ where, include: { category: true }, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
        prisma.news.count({ where }),
      ]);
      res.json({ status: 'success', data: news, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getBySlug: async (req: Request, res: Response) => {
    try {
      const article = await prisma.news.findUnique({ where: { slug: req.params.slug }, include: { category: true, tags: true } });
      if (!article) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: article });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const article = await prisma.news.findUnique({ where: { id: req.params.id } });
      if (!article) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: article });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
  create: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const slug = data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4) : 'article-' + Date.now();
      const article = await prisma.news.create({ data: { ...data, slug } });

      try {
        const users = await prisma.user.findMany({ select: { id: true } });
        if (users.length > 0) {
          await prisma.notification.createMany({
            data: users.map(u => ({
              userId: u.id, title: 'New Article!', message: `${req.body.title} — Read now!`, link: `/news/${slug}`, type: 'NEWS',
            })),
          });
        }
      } catch (e) {}

      res.status(201).json({ status: 'success', data: article });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  update: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const article = await prisma.news.update({ where: { id: req.params.id }, data });
      res.json({ status: 'success', data: article });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.news.update({ where: { id: req.params.id }, data: { status: 'ARCHIVED' } });
      res.json({ status: 'success', message: 'Archived' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};