import { Router } from 'express';
import { notificationsController } from '../controllers/notifications';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/', authenticate, notificationsController.getAll);
router.patch('/:id/read', authenticate, notificationsController.markRead);
router.patch('/read-all', authenticate, notificationsController.markAllRead);
router.post('/send-all', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), notificationsController.createForAll);
export default router;