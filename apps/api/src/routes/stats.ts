import { Router } from 'express';
import { statsController } from '../controllers/stats';

const router = Router();
router.get('/public', statsController.getPublic);
export default router;