import { Router } from 'express';
import { coursesController } from '../controllers/courses';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', coursesController.getAll);
router.get('/:slug', coursesController.getBySlug);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), coursesController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), coursesController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), coursesController.delete);

export default router;