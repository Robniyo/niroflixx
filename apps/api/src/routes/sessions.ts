import { Router } from 'express';
import { sessionsController } from '../controllers/sessions';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), sessionsController.getAll);
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), sessionsController.getById);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), sessionsController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), sessionsController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), sessionsController.delete);
export default router;