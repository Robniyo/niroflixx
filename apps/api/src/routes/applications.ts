import { Router } from 'express';
import { applicationsController } from '../controllers/applications';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Optional auth middleware – does not block unauthenticated users
const optionalAuth = (req: any, _res: any, next: any) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'niroflixx-super-secret-key-2025');
      req.userId = decoded.userId;
    } catch {}
  }
  next();
};

router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), applicationsController.getAll);
router.post('/', optionalAuth, applicationsController.create);
router.patch('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), applicationsController.updateStatus);

export default router;