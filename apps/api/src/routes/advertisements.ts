import { Router } from 'express';
import { advertisementsController } from '../controllers/advertisements';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/', advertisementsController.getAll);
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), advertisementsController.getById);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), advertisementsController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), advertisementsController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), advertisementsController.delete);
export default router;