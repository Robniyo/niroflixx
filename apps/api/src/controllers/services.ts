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
      const { serviceId, description, name, email, phone, paymentMethod } = req.body;
      const userId = (req as any).userId;

      let serviceName = serviceId;
      try {
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (service) serviceName = service.title;
      } catch {}

      // Always create a contact message for admin notification
      await prisma.contactMessage.create({
        data: {
          name,
          email,
          subject: `Service Request: ${serviceName}`,
          message: `Phone: ${phone || 'N/A'}\nPayment Method: ${paymentMethod || 'Not specified'}\n\n${description || 'No details provided'}`,
        },
      });

      // Create a ServiceRequest record for all users (authenticated or not)
      // If user is authenticated, link to their account
            const requestData: any = {
        serviceId,
        description,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        paymentMethod: paymentMethod || 'Not specified',
        notes: JSON.stringify({ name, email, phone }),
      };
      if (userId) {
        requestData.userId = userId;
      }

      const serviceRequest = await prisma.serviceRequest.create({ data: requestData });

      try {
        const { emailService } = await import('../services/email');
        await emailService.sendServiceRequestConfirmation(email, name, serviceName, description);
      } catch (e) { console.error('Service request email failed:', e); }

      res.status(201).json({ 
        status: 'success', 
        message: 'Request sent! We will contact you soon.', 
        data: { requestId: serviceRequest.id } 
      });
    } catch (error) { 
      console.error('SERVICE REQUEST ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); 
    }
  },

  // Get payment instructions (from settings)
  getPaymentSettings: async (_req: Request, res: Response) => {
    try {
      const bankDetails = await prisma.setting.findUnique({ where: { key: 'payment_bank_details' } });
      const momoDetails = await prisma.setting.findUnique({ where: { key: 'payment_momo_details' } });
      const instructions = await prisma.setting.findUnique({ where: { key: 'payment_instructions' } });
      res.json({
        status: 'success',
        data: {
          bankDetails: bankDetails?.value || '',
          momoDetails: momoDetails?.value || '',
          instructions: instructions?.value || '',
        },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  // User uploads payment proof
      uploadPaymentProof: async (req: Request, res: Response) => {
    try {
      const { paymentLink, proofUrl } = req.body;

      if (!paymentLink || !proofUrl) {
        return res.status(400).json({ status: 'error', message: 'paymentLink and proofUrl required', code: 400 });
      }

      const request = await prisma.serviceRequest.findUnique({ where: { paymentLink } });
      if (!request) return res.status(404).json({ status: 'error', message: 'Request not found', code: 404 });

      const updated = await prisma.serviceRequest.update({
        where: { id: request.id },
        data: { paymentProof: proofUrl, paymentStatus: 'PENDING_VERIFICATION' },
      });

      // Notify admins
      try {
        const admins = await prisma.user.findMany({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } }, select: { id: true } });
        if (admins.length > 0) {
          await prisma.notification.createMany({
            data: admins.map(a => ({
              userId: a.id,
              title: 'Payment Proof Submitted',
              message: `A payment proof has been submitted for service request #${request.id.slice(0, 8)}.`,
              link: '/admin/services',
              type: 'PAYMENT',
            })),
          });
        }
      } catch (e) {}

      res.json({ status: 'success', data: updated });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  // Admin updates payment status (approve/reject)
  updatePaymentStatus: async (req: Request, res: Response) => {
    try {
      const { paymentStatus, notes } = req.body; // paymentStatus: 'PAID' or 'REJECTED'
      const request = await prisma.serviceRequest.update({
        where: { id: req.params.id },
        data: { paymentStatus, notes },
      });

      // Notify the user about payment status change
      if (request.userId) {
        try {
          await prisma.notification.create({
            data: {
              userId: request.userId,
              title: paymentStatus === 'PAID' ? 'Payment Confirmed' : 'Payment Rejected',
              message: paymentStatus === 'PAID' 
                ? 'Your payment has been verified. We will begin working on your request.' 
                : `Your payment was not verified. Notes: ${notes || 'Please check your payment and try again.'}`,
              link: '/dashboard',
              type: 'PAYMENT',
            },
          });
        } catch (e) {}
      }

      res.json({ status: 'success', data: request });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
    // Public payment page accessed via unique link
  getPaymentPage: async (req: Request, res: Response) => {
    try {
      const request = await prisma.serviceRequest.findUnique({
        where: { paymentLink: req.params.link },
        include: { service: { select: { title: true, startingPrice: true } } },
      });
      if (!request) return res.status(404).json({ status: 'error', message: 'Payment link not found', code: 404 });
      if (request.paymentStatus === 'PAID') return res.status(400).json({ status: 'error', message: 'This request is already paid', code: 400 });

      const bankDetails = await prisma.setting.findUnique({ where: { key: 'payment_bank_details' } });
      const momoDetails = await prisma.setting.findUnique({ where: { key: 'payment_momo_details' } });
      const instructions = await prisma.setting.findUnique({ where: { key: 'payment_instructions' } });

      res.json({
        status: 'success',
        data: {
          requestId: request.id,
          serviceName: request.service?.title || 'Service',
          totalAmount: request.totalAmount || request.quotation || 0,
          amountPaid: request.amountPaid || 0,
          remainingBalance: request.remainingBalance || request.totalAmount || 0,
          paymentStatus: request.paymentStatus,
          bankDetails: bankDetails?.value || '',
          momoDetails: momoDetails?.value || '',
          instructions: instructions?.value || '',
        },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  // Admin generates payment link for a service request
  generatePaymentLink: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { totalAmount, notes } = req.body;

      const crypto = require('crypto');
      const paymentLink = crypto.randomBytes(8).toString('hex');

      const request = await prisma.serviceRequest.update({
        where: { id },
        data: {
          paymentLink,
          totalAmount: totalAmount || undefined,
          remainingBalance: totalAmount || undefined,
          notes: notes || undefined,
          status: 'AWAITING_PAYMENT',
          paymentStatus: 'UNPAID',
        },
      });

      res.json({ status: 'success', data: request });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
    getMyRequests: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const requests = await prisma.serviceRequest.findMany({
        where: { userId },
        include: { service: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ status: 'success', data: requests });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
};