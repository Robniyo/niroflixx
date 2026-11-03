import { Router } from 'express';
import { paymentsController } from '../controllers/payments';

const router = Router();

router.post('/initiate', paymentsController.initiatePayment);
router.post('/pawapay/callback', paymentsController.handleCallback);

export default router;