import { Router } from 'express';
import { resourcesController } from '../controllers/resources';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', resourcesController.getAll);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), resourcesController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), resourcesController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), resourcesController.delete);

// Increment download count (public)
router.post('/:id/increment', resourcesController.incrementDownload);

// Single resource by id
router.get('/:id', resourcesController.getById);

export default router;