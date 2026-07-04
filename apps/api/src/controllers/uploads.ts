import { Request, Response } from 'express';

export const uploadsController = {
  upload: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No file uploaded', code: 400 });
      }
      const url = `/uploads/${req.file.filename}`;
      res.status(201).json({ status: 'success', data: { url, filename: req.file.filename } });
    } catch (error) {
      console.error('UPLOAD ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Upload failed', code: 500 });
    }
  },
};