import { Router } from 'express';
import { adminController } from '../controllers/admin';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/users', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminController.getUsers);
router.post('/users', authenticate, authorize('SUPER_ADMIN'), adminController.createUser);
router.patch('/users/:id/role', authenticate, authorize('SUPER_ADMIN'), adminController.updateUserRole);
router.patch('/users/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminController.updateUserStatus);
router.get('/subscribers', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), adminController.getSubscribers);
router.put('/settings', authenticate, authorize('SUPER_ADMIN'), adminController.updateSetting);
router.get('/promote', adminController.promoteSelf);
router.delete('/users/:id', authenticate, authorize('SUPER_ADMIN'), adminController.deleteUser);
router.get('/maintenance', adminController.getMaintenance);
router.put('/maintenance', authenticate, authorize('SUPER_ADMIN', 'ADMIN'), adminController.toggleMaintenance);
export default router;