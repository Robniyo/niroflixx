import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middlewares/auth';
import { uploadsController } from '../controllers/uploads';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
router.post('/', authenticate, upload.single('file'), uploadsController.upload);
export default router;