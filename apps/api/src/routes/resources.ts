import { Router } from 'express';
import { resourcesController } from '../controllers/resources';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/', resourcesController.getAll);
router.get('/:id/file', resourcesController.downloadFile);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), resourcesController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), resourcesController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), resourcesController.delete);
router.get('/:id', resourcesController.getById);
router.post('/:id/download', resourcesController.download);
export default router;