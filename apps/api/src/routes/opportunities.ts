import { Router } from 'express';
import { opportunitiesController } from '../controllers/opportunities';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', opportunitiesController.getAll);
router.get('/:id', opportunitiesController.getById);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), opportunitiesController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), opportunitiesController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), opportunitiesController.delete);

export default router;