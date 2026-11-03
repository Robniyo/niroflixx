import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

export const paymentsController = {
  initiatePayment: async (req: Request, res: Response) => {
    try {
      const { resourceId, phoneNumber, amount, provider } = req.body;
      
      if (!resourceId || !phoneNumber || !amount || !provider) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields', code: 400 });
      }

      // 1. Create a payment record in database (status PENDING)
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

      // 2. Call PawaPay API (Sandbox)
      const PAWAPAY_TOKEN = process.env.PAWAPAY_API_TOKEN;
      if (!PAWAPAY_TOKEN) {
        return res.status(500).json({ status: 'error', message: 'Payment gateway not configured', code: 500 });
      }

      const payload = {
        amount: amount,
        currency: 'RWF',
        correspondent: provider,
        payer: {
          type: 'MMO',
          address: {
            value: phoneNumber,
          },
        },
        customerTimestamp: new Date().toISOString(),
        statementDescription: 'Future Scholars Payment',
        callbackUrl: 'https://niroflixx.onrender.com/api/v1/payments/pawapay/callback',
      };

      const response = await fetch('https://api.sandbox.pawapay.io/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAWAPAY_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({ status: 'error', message: data.message || 'PawaPay error', code: response.status });
      }

      // 3. Update payment record with PawaPay reference
      await prisma.resourceRequest.update({
        where: { id: payment.id },
        data: {
          name: 'PawaPay User',
          email: 'user@fscholars.online',
          paymentId: data.paymentId, // <--- KORESHA paymentId AHO KUBA notes
        },
      });

      res.json({ status: 'success', message: 'Payment initiated', data: { paymentId: data.paymentId } });
    } catch (error: any) {
      console.error('PAWAPAY ERROR:', error);
      res.status(500).json({ status: 'error', message: error.message || 'Payment failed', code: 500 });
    }
  },

  handleCallback: async (req: Request, res: Response) => {
    try {
      const { paymentId, status } = req.body;
      if (!paymentId || !status) {
        return res.status(400).json({ status: 'error', message: 'Invalid callback', code: 400 });
      }

      // Find the request by paymentId
      const request = await prisma.resourceRequest.findFirst({
        where: { paymentId: paymentId }, // <--- KORESHA paymentId AHO KUBA notes
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