import { Router } from 'express';
import { servicesController } from '../controllers/services';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/', servicesController.getAll);
router.get('/:slug', servicesController.getBySlug);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), servicesController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), servicesController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), servicesController.delete);
router.post('/request', servicesController.requestService);
export default router;