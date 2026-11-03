import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const paymentsController = {
  initiatePayment: async (req: Request, res: Response) => {
    try {
      const { resourceId, phoneNumber, amount, provider } = req.body;
      
      if (!resourceId || !phoneNumber || !amount || !provider) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields', code: 400 });
      }

      const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
      if (!resource) {
        return res.status(404).json({ status: 'error', message: 'Resource not found', code: 404 });
      }

      const payment = await prisma.resourceRequest.create({
        data: {
          resourceId,
          name: 'Pending',
          email: 'pending@test.com',
          phone: phoneNumber,
          screenshot: null,
          status: 'PENDING',
        },
      });

      const PAWAPAY_TOKEN = process.env.PAWAPAY_API_TOKEN;
      if (!PAWAPAY_TOKEN) {
        return res.status(500).json({ status: 'error', message: 'Payment gateway not configured', code: 500 });
      }

      const payload = {
        depositId: payment.id,
        amount: String(amount),
        currency: 'RWF',
        correspondent: provider,
        payer: {
          type: 'MMO',
          accountDetails: {
            phoneNumber: phoneNumber,
            provider: provider,
          },
        },
        customerTimestamp: new Date().toISOString(),
        customerMessage: 'Future Scholars', // 4-22 chars
        // callbackUrl: '...' // <--- KURAho IYI (ntiyemewe muri v2/deposits)
      };

      console.log('PAWAPAY PAYLOAD:', JSON.stringify(payload));

      const response = await fetch('https://api.sandbox.pawapay.io/v2/deposits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAWAPAY_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log('PAWAPAY RESPONSE:', text);

      if (!response.ok) {
        return res.status(response.status).json({ status: 'error', message: text || 'PawaPay error', code: response.status });
      }

      const data = JSON.parse(text);

      await prisma.resourceRequest.update({
        where: { id: payment.id },
        data: {
          name: 'PawaPay User',
          email: 'user@fscholars.online',
          paymentId: data.depositId || payment.id,
        },
      });

      res.json({ status: 'success', message: 'Payment initiated', data: { paymentId: data.depositId } });
    } catch (error: any) {
      console.error('PAWAPAY ERROR:', error);
      res.status(500).json({ status: 'error', message: error.message || 'Payment failed', code: 500 });
    }
  },

  handleCallback: async (req: Request, res: Response) => {
    try {
      const { depositId, status } = req.body;
      if (!depositId || !status) {
        return res.status(400).json({ status: 'error', message: 'Invalid callback', code: 400 });
      }

      const request = await prisma.resourceRequest.findFirst({
        where: { paymentId: depositId },
      });

      if (request) {
        await prisma.resourceRequest.update({
          where: { id: request.id },
          data: { status: status === 'COMPLETED' ? 'APPROVED' : 'REJECTED' },
        });
      }

      res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('CALLBACK ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Callback failed', code: 500 });
    }
  },
};