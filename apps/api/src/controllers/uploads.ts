import { Request, Response } from 'express';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dlxiuwv30',
  api_key: process.env.CLOUDINARY_API_KEY || '539891243736556',
  api_secret: process.env.CLOUDINARY_API_SECRET || '5PLzE4P8DUDH1YnAr-Nggmv5cvQ',
});

export const uploadsController = {
  upload: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No file uploaded', code: 400 });
      }

      const b64 = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname?.endsWith('.pdf');

      const result = await cloudinary.v2.uploader.upload(dataURI, {
        folder: 'niroflixx',
        resource_type: isPdf ? 'raw' : 'image',
        access_mode: 'public',
      });

      res.status(201).json({
        status: 'success',
        data: { url: result.secure_url, publicId: result.public_id, filename: req.file.originalname },
      });
    } catch (error) {
      console.error('UPLOAD ERROR:', error);
      res.status(500).json({ status: 'error', message: 'Upload failed', code: 500 });
    }
  },
};