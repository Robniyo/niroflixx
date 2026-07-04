import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../models/prisma';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Authentication required', code: 401 });
    }
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token', code: 401 });
  }
}

export function authorize(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ status: 'error', message: 'Insufficient permissions', code: 403 });
      }
      (req as any).userRole = user.role;
      next();
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Authorization failed', code: 500 });
    }
  };
}