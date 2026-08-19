import { Router } from 'express';
import { resourcesController } from '../controllers/resources';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Public
router.get('/', resourcesController.getAll);
router.get('/:id/preview', resourcesController.previewFile);
router.get('/:id/download', resourcesController.downloadFile);

// Auth
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), resourcesController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), resourcesController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), resourcesController.delete);

// Public single
router.get('/:id', resourcesController.getById);

export default router;