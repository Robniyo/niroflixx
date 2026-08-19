import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

const cleanData = (data: any) => {
  const cleaned: any = {};
  for (const key of Object.keys(data)) {
    if (data[key] === '' || data[key] === null || data[key] === undefined) continue;
    if (['price', 'downloadCount'].includes(key)) cleaned[key] = Number(data[key]);
    else cleaned[key] = data[key];
  }
  return cleaned;
};

// Helper to resolve file URL (handles relative /uploads)
function resolveFileUrl(url: string) {
  return url.startsWith('http') ? url : `${process.env.BACKEND_URL || 'https://niroflixx.onrender.com'}${url.startsWith('/') ? url : '/' + url}`;
}

export const resourcesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 12 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const [resources, total] = await Promise.all([
        prisma.resource.findMany({ where: { status: 'PUBLISHED' }, include: { category: true }, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
        prisma.resource.count({ where: { status: 'PUBLISHED' } }),
      ]);
      res.json({ status: 'success', data: resources, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const resource = await prisma.resource.findUnique({ where: { id: req.params.id } });
      if (!resource) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: resource });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  create: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const slug = data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4) : 'resource-' + Date.now();
      const resource = await prisma.resource.create({ data: { ...data, slug } });

      try {
        const users = await prisma.user.findMany({ select: { id: true } });
        if (users.length > 0) {
          await prisma.notification.createMany({
            data: users.map(u => ({
              userId: u.id, title: 'New Resource!', message: `${req.body.title} — Download now!`, link: `/resources`, type: 'RESOURCE',
            })),
          });
        }
      } catch (e) {}

      res.status(201).json({ status: 'success', data: resource });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  update: async (req: Request, res: Response) => {
    try {
      const data = cleanData(req.body);
      const resource = await prisma.resource.update({ where: { id: req.params.id }, data });
      res.json({ status: 'success', data: resource });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.resource.update({ where: { id: req.params.id }, data: { status: 'ARCHIVED' } });
      res.json({ status: 'success', message: 'Archived' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  incrementDownload: async (req: Request, res: Response) => {
    try {
      const resource = await prisma.resource.findUnique({ where: { id: req.params.id } });
      if (!resource) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });

      await prisma.resource.update({
        where: { id: resource.id },
        data: { downloadCount: { increment: 1 } },
      });

      res.json({ status: 'success', data: { downloadCount: resource.downloadCount + 1 } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  // Preview file inline (for PDF/images)
     previewFile: async (req: Request, res: Response) => {
    try {
      const resource = await prisma.resource.findUnique({ where: { id: req.params.id } });
      if (!resource || !resource.fileUrl) {
        return res.status(404).json({ status: 'error', message: 'File not found', code: 404 });
      }

      const fileUrl = resolveFileUrl(resource.fileUrl);
      const response = await fetch(fileUrl);
      if (!response.ok) {
        return res.status(404).json({ status: 'error', message: 'File not accessible', code: 404 });
      }

      const buffer = await response.arrayBuffer();
      const isPdf = resource.type === 'PDF' || fileUrl.toLowerCase().includes('.pdf') || resource.fileUrl.toLowerCase().includes('.pdf');
      const contentType = isPdf ? 'application/pdf' : (response.headers.get('content-type') || 'application/octet-stream');

      let filename = resource.title || 'preview';
      filename = filename.replace(/[^a-zA-Z0-9]+/g, '_');
      if (isPdf) filename += '.pdf';

      // Allow iframe embedding from Vercel (fixes 'refused to connect')
      res.removeHeader('X-Frame-Options');
      res.setHeader('Content-Security-Policy', "frame-ancestors https://niroflixx.vercel.app");

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.send(Buffer.from(buffer));
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Preview failed', code: 500 });
    }
  },

  // Download file (forces attachment)
    downloadFile: async (req: Request, res: Response) => {
    try {
      const resource = await prisma.resource.findUnique({ where: { id: req.params.id } });
      if (!resource || !resource.fileUrl) {
        return res.status(404).json({ status: 'error', message: 'File not found', code: 404 });
      }

      const fileUrl = resolveFileUrl(resource.fileUrl);
      const response = await fetch(fileUrl);
      if (!response.ok) {
        return res.status(404).json({ status: 'error', message: 'File not accessible', code: 404 });
      }

      const buffer = await response.arrayBuffer();
      const isPdf = resource.type === 'PDF' || fileUrl.toLowerCase().includes('.pdf') || resource.fileUrl.toLowerCase().includes('.pdf');
      const contentType = isPdf ? 'application/pdf' : (response.headers.get('content-type') || 'application/octet-stream');

      await prisma.resource.update({
        where: { id: resource.id },
        data: { downloadCount: { increment: 1 } },
      });

      let filename = resource.title || 'document';
      filename = filename.replace(/[^a-zA-Z0-9]+/g, '_');
      filename += isPdf ? '.pdf' : (fileUrl.includes('.') ? '.' + fileUrl.split('.').pop()?.split('?')[0] : '');

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(Buffer.from(buffer));
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Download failed', code: 500 });
    }
  },
};