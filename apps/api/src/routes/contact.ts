import { Router } from 'express';
import { contactController } from '../controllers/contact';

const router = Router();
router.post('/', contactController.send);
export default router;