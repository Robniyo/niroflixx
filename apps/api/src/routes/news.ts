import { Router } from 'express';
import { newsController } from '../controllers/news';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/', newsController.getAll);
router.get('/:slug', newsController.getBySlug);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), newsController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), newsController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), newsController.delete);
export default router;