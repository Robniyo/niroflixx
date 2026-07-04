import { Router } from 'express';
import { enrollmentsController } from '../controllers/enrollments';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.post('/', authenticate, enrollmentsController.enroll);
router.get('/class/:classId', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'), enrollmentsController.getByClass);
export default router;