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

  updateMe: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { firstName, lastName, phone } = req.body;

      const data: any = {};
      if (firstName !== undefined) data.firstName = firstName;
      if (lastName !== undefined) data.lastName = lastName;
      if (phone !== undefined) data.phone = phone;

      const user = await prisma.user.update({
        where: { id: userId },
        data,
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, status: true, avatar: true, lastLogin: true, createdAt: true, profile: true },
      });

      res.json({ status: 'success', data: user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed to update profile', code: 500 });
    }
  },

  googleLogin: async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body;
      
      const { OAuth2Client } = await import('google-auth-library');
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(400).json({ status: 'error', message: 'Invalid Google token', code: 400 });
      }

      const { email, given_name, family_name, picture, sub: googleId } = payload;

      let user = await prisma.user.findFirst({
        where: { OR: [{ googleId }, { email }] },
      });

      if (user) {
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId, avatar: picture || user.avatar, emailVerified: true },
          });
        }
      } else {
        const username = email.split('@')[0] + '_' + Date.now().toString().slice(-4);
        user = await prisma.user.create({
          data: {
            firstName: given_name || 'Google',
            lastName: family_name || 'User',
            username,
            email,
            googleId,
            avatar: picture,
            emailVerified: true,
            password: null,
            role: 'USER',
            status: 'ACTIVE',
            profile: { create: {} },
          },
        });
      }

      const { token, refreshToken } = generateTokens(user.id);
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.json({
        status: 'success',
        message: 'Google login successful',
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
    } catch (error: any) {
      console.error('GOOGLE LOGIN ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Google login failed', code: 500 });
    }
  },

  // Server-side OAuth callback (used when client script doesn't load)
  googleCallback: async (req: Request, res: Response) => {
    try {
      const { code } = req.query;
      if (!code) {
        return res.redirect(`${process.env.FRONTEND_URL || 'https://niroflixx.vercel.app'}/login?error=google_failed`);
      }

      const { OAuth2Client } = require('google-auth-library');
      const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.BACKEND_URL || 'https://niroflixx.onrender.com'}/api/v1/auth/google/callback`
      );

      const { tokens } = await client.getToken(code as string);
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.redirect(`${process.env.FRONTEND_URL || 'https://niroflixx.vercel.app'}/login?error=invalid_token`);
      }

      const { email, given_name, family_name, picture, sub: googleId } = payload;

      let user = await prisma.user.findFirst({
        where: { OR: [{ googleId }, { email }] },
      });

      if (user) {
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId, avatar: picture || user.avatar, emailVerified: true },
          });
        }
      } else {
        const username = email.split('@')[0] + '_' + Date.now().toString().slice(-4);
        user = await prisma.user.create({
          data: {
            firstName: given_name || 'Google',
            lastName: family_name || 'User',
            username,
            email,
            googleId,
            avatar: picture,
            emailVerified: true,
            password: null,
            role: 'USER',
            status: 'ACTIVE',
            profile: { create: {} },
          },
        });
      }

      const { token, refreshToken } = generateTokens(user.id);
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
      });

      return res.redirect(`${process.env.FRONTEND_URL || 'https://niroflixx.vercel.app'}`);
    } catch (error) {
      console.error('GOOGLE CALLBACK ERROR:', error);
      return res.redirect(`${process.env.FRONTEND_URL || 'https://niroflixx.vercel.app'}/login?error=google_failed`);
    }
  },
};