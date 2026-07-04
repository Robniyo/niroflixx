import { Router } from 'express';
import { testimonialsController } from '../controllers/testimonials';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/published', testimonialsController.getPublished);
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), testimonialsController.getById);
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), testimonialsController.getAll);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), testimonialsController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), testimonialsController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), testimonialsController.delete);
export default router;