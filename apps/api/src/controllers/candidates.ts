import { Request, Response } from 'express';
import { prisma } from '../models/prisma';

const cleanData = (data: any) => {
  const cleaned: any = {};
  for (const key of Object.keys(data)) {
    if (data[key] === '' || data[key] === null || data[key] === undefined) continue;
    if (['experienceYears', 'completionScore'].includes(key)) cleaned[key] = Number(data[key]);
    else cleaned[key] = data[key];
  }
  return cleaned;
};

export const candidatesController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const candidates = await prisma.candidate.findMany({
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ status: 'success', data: candidates });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getMyProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      let candidate = await prisma.candidate.findUnique({
        where: { userId },
        include: { education: true, experiences: true, skills: true, certificates: true, documents: true },
      });
if (!candidate) {
  return res.json({ status: 'success', data: null, message: 'Candidate profile not created yet' });
}
      res.json({ status: 'success', data: candidate });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const data = cleanData(req.body);
      const candidate = await prisma.candidate.upsert({
        where: { userId },
        update: data,
        create: { userId, ...data },
      });
      res.json({ status: 'success', data: candidate });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

addEducation: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      let candidate = await prisma.candidate.findUnique({ where: { userId } });
      if (!candidate) {
        candidate = await prisma.candidate.create({ data: { userId, status: 'active' } });
      }
      const data = { ...req.body };
if (data.startDate && data.startDate !== '') {
  data.startDate = new Date(data.startDate);
} else {
  data.startDate = new Date();
}
      if (data.endDate && data.endDate !== '') data.endDate = new Date(data.endDate);
      else delete data.endDate;
      const edu = await prisma.education.create({ data: { ...data, candidateId: candidate.id } });
      res.status(201).json({ status: 'success', data: edu });
    } catch (error) {
      console.error('ADD EDUCATION ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },

  addExperience: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      let candidate = await prisma.candidate.findUnique({ where: { userId } });
      if (!candidate) {
        candidate = await prisma.candidate.create({ data: { userId, status: 'active' } });
      }
      const data = { ...req.body };
if (data.startDate && data.startDate !== '') {
  data.startDate = new Date(data.startDate);
} else {
  data.startDate = new Date();
}
      if (data.endDate && data.endDate !== '') data.endDate = new Date(data.endDate);
      else delete data.endDate;
      const exp = await prisma.experience.create({ data: { ...data, candidateId: candidate.id } });
      res.status(201).json({ status: 'success', data: exp });
    } catch (error) {
      console.error('ADD EXPERIENCE ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Failed', code: 500 });
    }
  },
  addDocument: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      let candidate = await prisma.candidate.findUnique({ where: { userId } });
      if (!candidate) {
        candidate = await prisma.candidate.create({ data: { userId, status: 'active' } });
      }
      const doc = await prisma.candidateDocument.create({
        data: { ...req.body, candidateId: candidate.id },
      });
      res.status(201).json({ status: 'success', data: doc });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  addSkill: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const candidate = await prisma.candidate.findUnique({ where: { userId } });
      if (!candidate) return res.status(404).json({ status: 'error', message: 'Candidate not found', code: 404 });
      const skill = await prisma.candidateSkill.create({ data: { ...req.body, candidateId: candidate.id } });
      res.status(201).json({ status: 'success', data: skill });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const candidate = await prisma.candidate.findUnique({
        where: { id: req.params.id },
        include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } }, education: true, experiences: true, skills: true, certificates: true, documents: true, applications: { include: { opportunity: true } } },
      });
      if (!candidate) return res.status(404).json({ status: 'error', message: 'Not found', code: 404 });
      res.json({ status: 'success', data: candidate });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const candidate = await prisma.candidate.update({ where: { id: req.params.id }, data: { status } });
      res.json({ status: 'success', data: candidate });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
  checkStatus: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const candidate = await prisma.candidate.findUnique({
        where: { userId },
        select: { id: true, status: true, headline: true, completionScore: true },
      });
      if (!candidate) return res.json({ status: 'success', data: { exists: false } });
      res.json({ status: 'success', data: { exists: true, ...candidate } });
    } catch (error) { res.status(500).json({ status: 'error', message: 'Failed', code: 500 }); }
  },
};