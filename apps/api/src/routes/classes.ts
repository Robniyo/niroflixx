import { Router } from 'express';
import { classesController } from '../controllers/classes';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/courses', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), classesController.getCourses);
router.get('/trainers', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), classesController.getTrainers);
router.get('/', classesController.getAll);
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), classesController.getById);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), classesController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), classesController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), classesController.delete);
export default router;