import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const coursesController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 12, status, featured, categoryId, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (status) where.status = status;
      if (featured) where.featured = featured === 'true';
      if (categoryId) where.categoryId = categoryId as string;
      if (search) where.title = { contains: search as string };

      const [courses, total] = await Promise.all([
        prisma.course.findMany({ where, include: { category: true, tags: true }, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
        prisma.course.count({ where }),
      ]);

      res.json({ status: 'success', data: courses, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed to fetch courses', code: 500 }); }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const course = await prisma.course.findUnique({ where: { id: req.params.id }, include: { category: true, tags: true, lessons: { orderBy: { orderNumber: 'asc' } } } });
      if (!course) return res.status(404).json({ status: 'error', message: 'Course not found', code: 404 });
      res.json({ status: 'success', data: course });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed to fetch course', code: 500 }); }
  },

  getBySlug: async (req: Request, res: Response) => {
    try {
      const course = await prisma.course.findUnique({ where: { slug: req.params.slug }, include: { category: true, tags: true, lessons: { orderBy: { orderNumber: 'asc' } } } });
      if (!course) return res.status(404).json({ status: 'error', message: 'Course not found', code: 404 });
      res.json({ status: 'success', data: course });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed to fetch course', code: 500 }); }
  },

  create: async (req: Request, res: Response) => {
    try {
      const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const course = await prisma.course.create({ data: { ...req.body, slug }, include: { category: true } });

      // Notify all users
      const users = await prisma.user.findMany({ select: { id: true } });
      if (users.length > 0) {
        await prisma.notification.createMany({
          data: users.map(u => ({
            userId: u.id,
            title: 'New Course Available!',
            message: `${req.body.title} has been published. Check it out!`,
            link: `/academy/${slug}`,
            type: 'COURSE',
          })),
        });
      }

      res.status(201).json({ status: 'success', message: 'Course created', data: course });
    } catch (error) {
      console.error('CREATE COURSE ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Failed to create course', code: 500 });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const course = await prisma.course.update({ where: { id: req.params.id }, data: req.body });
      res.json({ status: 'success', message: 'Course updated', data: course });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed to update course', code: 500 }); }
  },

  delete: async (req: Request, res: Response) => {
    try {
      await prisma.course.update({ where: { id: req.params.id }, data: { status: 'ARCHIVED' } });
      res.json({ status: 'success', message: 'Course archived' });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed to delete course', code: 500 }); }
  },
    enroll: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { courseId, paymentPlan } = req.body; // paymentPlan: FULL, HALF, CUSTOM

      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) return res.status(404).json({ status: 'error', message: 'Course not found', code: 404 });

      const totalAmount = course.price || 0;
      let remainingBalance = totalAmount;
      if (paymentPlan === 'HALF') remainingBalance = Math.round(totalAmount / 2);
      else if (paymentPlan === 'FULL') remainingBalance = totalAmount;
      // CUSTOM: remainingBalance remains totalAmount – user will pay whatever they can

      const existing = await prisma.enrollment.findUnique({
        where: { courseId_userId: { courseId, userId } },
      });
      if (existing) return res.status(400).json({ status: 'error', message: 'Already enrolled', code: 400 });

      const enrollment = await prisma.enrollment.create({
        data: {
          courseId,
          userId,
          paymentPlan,
          totalAmount,
          amountPaid: 0,
          remainingBalance,
          paymentStatus: 'UNPAID',
          status: 'active',
        },
      });

      res.status(201).json({ status: 'success', data: enrollment });
    } catch (error) {
      console.error('ENROLLMENT ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Enrollment failed', code: 500 });
    }
  },

  getMyEnrollments: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: { course: { select: { title: true, price: true, slug: true, coverImage: true } } },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ status: 'success', data: enrollments });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  payEnrollment: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const { enrollmentId, amount, proofUrl } = req.body;

      const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
      if (!enrollment || enrollment.userId !== userId) return res.status(404).json({ status: 'error', message: 'Enrollment not found', code: 404 });

      const newAmountPaid = (enrollment.amountPaid || 0) + Number(amount);
      const remaining = Math.max(0, (enrollment.totalAmount || 0) - newAmountPaid);
      const paymentStatus = remaining === 0 ? 'PAID' : 'PARTIALLY_PAID';

      const updated = await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          amountPaid: newAmountPaid,
          remainingBalance: remaining,
          paymentStatus,
          lastPaymentDate: new Date(),
          paymentProof: proofUrl || undefined,
        },
      });

      // Send confirmation email
      try {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true } });
        if (user?.email) {
          const { emailService } = await import('../services/email');
          emailService.sendEnrollmentPaymentConfirmation(user.email, user.firstName, enrollment.courseId, amount, remaining)
            .catch(e => console.error('Payment email failed:', e));
        }
      } catch (e) {}

      res.json({ status: 'success', data: updated });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Payment failed', code: 500 });
    }
  },
};