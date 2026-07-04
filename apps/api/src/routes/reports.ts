import { Router } from 'express';
import { reportsController } from '../controllers/reports';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/class/:classId', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), reportsController.getClassAttendance);
router.get('/all', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), reportsController.getAllAttendance);
export default router;