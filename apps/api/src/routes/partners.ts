import { Router } from 'express';
import { partnersController } from '../controllers/partners';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/', partnersController.getAll);
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), partnersController.getById);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), partnersController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), partnersController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), partnersController.delete);
export default router;