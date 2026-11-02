import { Router } from 'express';
import { authController } from '../controllers/auth';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);
router.put('/me', authenticate, authController.updateMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/google', authController.googleLogin);

// UPDATED GOOGLE LOGIN ROUTE
router.get('/google', (req, res) => {
  // Ibi bituma Google ibona fscholars.online gusa, atari niroflixx.onrender.com
  const frontendUrl = process.env.FRONTEND_URL || 'https://fscholars.online';
  const redirectUri = `${frontendUrl}/api/v1/auth/google/callback`;
  
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('email profile')}`;
  
  res.redirect(url);
});

router.get('/google/callback', authController.googleCallback);
export default router;