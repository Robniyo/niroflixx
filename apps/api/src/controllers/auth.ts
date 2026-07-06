import { Request, Response } from 'express';
import { prisma } from '../models/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { emailService } from '../services/email';

const generateTokens = (userId: string) => {
  const token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  const refreshToken = jwt.sign({ userId }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn });
  return { token, refreshToken };
};

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, username, email, password } = req.body;
      const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
      if (existing) return res.status(409).json({ status: 'error', message: 'Email or username already exists', code: 409 });

      const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);
      const user = await prisma.user.create({
        data: { firstName, lastName, username, email, password: hashedPassword, role: 'USER', status: 'ACTIVE', profile: { create: {} } },
      });

      const { token, refreshToken } = generateTokens(user.id);
      await prisma.session.create({ data: { userId: user.id, token, refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });

      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000, path: '/' });

      // Send welcome email
      emailService.sendWelcome(email, firstName).catch(e => console.error('Email failed:', e));

      res.status(201).json({ status: 'success', message: 'Account created', data: { id: user.id, firstName, lastName, email, role: user.role } });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Registration failed', code: 500 }); }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
      if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ status: 'error', message: 'Invalid email or password', code: 401 });
      if (user.status === 'SUSPENDED' || user.status === 'DELETED') return res.status(403).json({ status: 'error', message: 'Account suspended or deleted', code: 403 });

      const { token, refreshToken } = generateTokens(user.id);
      await prisma.session.create({ data: { userId: user.id, token, refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });
      await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000, path: '/' });

      res.json({ status: 'success', message: 'Login successful', data: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, profile: user.profile } });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Login failed', code: 500 }); }
  },

  logout: async (req: Request, res: Response) => {
    res.clearCookie('token', { path: '/', secure: true, sameSite: 'none' });
    res.json({ status: 'success', message: 'Logged out' });
  },

  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'No account found with this email address', code: 404 });
      }

      const resetToken = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });
      
      emailService.sendPasswordReset(email, resetToken).catch(e => console.error('Email failed:', e));
      
      res.json({ status: 'success', message: 'Reset link sent to your email' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
      const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);
      await prisma.user.update({ where: { id: decoded.userId }, data: { password: hashedPassword } });
      res.json({ status: 'success', message: 'Password reset successful' });
    } catch (error) { res.status(400).json({ status: 'error', message: 'Invalid or expired token', code: 400 }); }
  },

  me: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, firstName: true, lastName: true, username: true, email: true, phone: true, role: true, status: true, avatar: true, lastLogin: true, createdAt: true, profile: true },
      });
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found', code: 404 });
      res.json({ status: 'success', data: user });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed to get user', code: 500 }); }
  },
};