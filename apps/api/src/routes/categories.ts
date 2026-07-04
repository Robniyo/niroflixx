import { Router } from 'express';
import { categoriesController } from '../controllers/categories';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/', categoriesController.getAll);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), categoriesController.create);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), categoriesController.delete);
export default router;