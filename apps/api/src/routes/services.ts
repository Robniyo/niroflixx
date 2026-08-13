import { Router } from 'express';
import { servicesController } from '../controllers/services';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Public
router.get('/', servicesController.getAll);
router.get('/payment-settings', servicesController.getPaymentSettings);
router.get('/id/:id', servicesController.getById);
router.get('/:slug', servicesController.getBySlug);
router.post('/request', servicesController.requestService);

// Authenticated users
router.post('/payment-proof', servicesController.uploadPaymentProof);

// Admin
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), servicesController.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER'), servicesController.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), servicesController.delete);
router.put('/payment-status/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), servicesController.updatePaymentStatus);
// Public payment page (no auth required)
router.get('/payment/:link', servicesController.getPaymentPage);

// Admin generates payment link
router.post('/generate-payment-link/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), servicesController.generatePaymentLink);
router.get('/my-requests', authenticate, servicesController.getMyRequests);
router.patch('/payment-status/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), servicesController.updatePaymentStatus);
export default router;