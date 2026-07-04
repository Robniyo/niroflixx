import { Router } from 'express';
import { candidatesController } from '../controllers/candidates';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();
router.get('/status', authenticate, candidatesController.checkStatus);
router.get('/me', authenticate, candidatesController.getMyProfile);
router.put('/me', authenticate, candidatesController.updateProfile);
router.post('/education', authenticate, candidatesController.addEducation);
router.post('/experience', authenticate, candidatesController.addExperience);
router.post('/skills', authenticate, candidatesController.addSkill);
router.post('/documents', authenticate, candidatesController.addDocument);
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), candidatesController.getAll);
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), candidatesController.getById);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), candidatesController.updateStatus);
export default router;