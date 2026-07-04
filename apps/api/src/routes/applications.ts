import { Router } from 'express';
import { applicationsController } from '../controllers/applications';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.post('/', applicationsController.create);
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), applicationsController.getAll);
router.patch('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), applicationsController.updateStatus);
export default router;