import { Router } from 'express';
import multer from 'multer';
import { uploadsController } from '../controllers/uploads';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
router.post('/', upload.single('file'), uploadsController.upload);
export default router;