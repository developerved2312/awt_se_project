import express from 'express';
import {
  loginUser,
  demoLogin,
  getCurrentUser,
  registerFarmer,
  getDemoUsers,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth endpoints
router.post('/login', loginUser);
router.post('/demo-login', demoLogin);
router.post('/register', registerFarmer);
router.get('/demo-users', getDemoUsers);

// Protected user profile endpoints
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);

export default router;
