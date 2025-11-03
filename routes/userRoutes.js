import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);

export default router;

