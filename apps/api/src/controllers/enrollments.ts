import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const enrollmentsController = {
  enroll: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { courseId } = req.body;

      const existing = await prisma.enrollment.findUnique({
        where: { courseId_userId: { courseId, userId } },
      });

      if (existing) {
        return res.status(409).json({ status: 'error', message: 'Already enrolled', code: 409 });
      }

      const enrollment = await prisma.enrollment.create({
        data: { courseId, userId },
      });

      await prisma.course.update({
        where: { id: courseId },
        data: { enrollmentCount: { increment: 1 } },
      });

      res.status(201).json({ status: 'success', message: 'Enrolled successfully', data: enrollment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Enrollment failed', code: 500 });
    }
  },
  getByClass: async (req: Request, res: Response) => {
    try {
      const { classId } = req.params;
      const enrollments = await prisma.enrollment.findMany({
        where: { course: { classes: { some: { id: classId } } } },
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } }, course: { select: { title: true } } },
      });
      res.json({ status: 'success', data: enrollments });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
};