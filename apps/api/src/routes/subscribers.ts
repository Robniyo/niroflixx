import { Router } from 'express';
import { subscribersController } from '../controllers/subscribers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.post('/', subscribersController.subscribe);
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), subscribersController.getAll);

export default router;