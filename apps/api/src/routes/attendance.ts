import { Router } from 'express';
import { attendanceController } from '../controllers/attendance';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/class/:classId', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), attendanceController.getByClass);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), attendanceController.mark);
export default router;