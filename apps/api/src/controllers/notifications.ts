import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const notificationsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      const unreadCount = await prisma.notification.count({ where: { userId, read: false } });
      res.json({ status: 'success', data: notifications, unreadCount });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  markRead: async (req: Request, res: Response) => {
    try {
      await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
      res.json({ status: 'success', message: 'Marked as read' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  markAllRead: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
      res.json({ status: 'success', message: 'All marked as read' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  createForAll: async (req: Request, res: Response) => {
    try {
      const { title, message, link, type } = req.body;
      const users = await prisma.user.findMany({ select: { id: true } });
      const data = users.map(u => ({ userId: u.id, title, message, link: link || '', type: type || 'ANNOUNCEMENT' }));
      await prisma.notification.createMany({ data });
      res.status(201).json({ status: 'success', message: `Sent to ${users.length} users` });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};