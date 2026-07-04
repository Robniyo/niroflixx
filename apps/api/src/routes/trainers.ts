import { Router } from 'express';
import { trainersController } from '../controllers/trainers';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), trainersController.getAll);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), trainersController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), trainersController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), trainersController.delete);
export default router;